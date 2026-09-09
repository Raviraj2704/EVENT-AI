# ============================================================================
# Learning Paths Routes
# ============================================================================
# File: app/routes/learning_paths.py
# Purpose: Learning path management and progress tracking
# Status: Production-Ready
# ============================================================================

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_
from datetime import datetime
from typing import Optional
import logging

from app.database import get_db
from app.models import (
    LearningPath,
    LearningModule,
    UserLearningProgress,
    User,
    Leaderboard,
)
from app.schemas import (
    LearningPathResponse,
    LearningPathDetailResponse,
    LearningModuleResponse,
    LearningPathEnrollRequest,
    LearningPathProgressRequest,
    ErrorResponse,
)
from app.routes.users import get_current_user


logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/api/v1/learning-paths",
    tags=["Learning Paths"]
)


# ============================================================================
# GET ALL LEARNING PATHS
# ============================================================================

@router.get(
    "",
    response_model=dict,
    responses={
        400: {"model": ErrorResponse},
        500: {"model": ErrorResponse},
    },
)
async def get_learning_paths(
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=50),
    difficulty: Optional[str] = None,
    search: Optional[str] = None,
    current_user: Optional[User] = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Get all published learning paths.

    Supports:
    - Pagination
    - Difficulty filtering
    - Title/description search
    - Optional user progress information
    """

    try:
        query = (
            db.query(LearningPath)
            .filter(LearningPath.is_published.is_(True))
        )

        # ------------------------------------------------------------
        # Difficulty filter
        # ------------------------------------------------------------
        if difficulty:
            query = query.filter(
                LearningPath.difficulty_level == difficulty
            )

        # ------------------------------------------------------------
        # Search
        # ------------------------------------------------------------
        if search:
            search_term = f"%{search.strip()}%"

            query = query.filter(
                or_(
                    LearningPath.title.ilike(search_term),
                    LearningPath.description.ilike(search_term),
                )
            )

        # ------------------------------------------------------------
        # Ordering
        # ------------------------------------------------------------
        query = query.order_by(
            LearningPath.created_at.desc()
        )

        # ------------------------------------------------------------
        # Total count
        # ------------------------------------------------------------
        total = query.count()

        # ------------------------------------------------------------
        # Pagination
        # ------------------------------------------------------------
        paths = (
            query
            .offset((page - 1) * limit)
            .limit(limit)
            .all()
        )

        paths_data = []

        # ------------------------------------------------------------
        # Build response
        # ------------------------------------------------------------
        for path in paths:

            path_resp = LearningPathResponse.model_validate(path)

            # --------------------------------------------------------
            # Check current user's enrollment/progress
            # --------------------------------------------------------
            if current_user:

                progress = (
                    db.query(UserLearningProgress)
                    .filter(
                        and_(
                            UserLearningProgress.user_id
                            == current_user.id,

                            UserLearningProgress.learning_path_id
                            == path.id,
                        )
                    )
                    .first()
                )

                if progress:

                    path_resp.user_progress = {
                        "enrolled": True,
                        "progress_percentage": (
                            progress.progress_percentage
                        ),
                        "modules_completed": (
                            progress.modules_completed
                        ),
                        "is_completed": (
                            progress.is_completed
                        ),
                    }

            paths_data.append(path_resp)

        return {
            "total": total,
            "page": page,
            "limit": limit,
            "total_pages": (
                (total + limit - 1) // limit
                if total > 0
                else 0
            ),
            "has_next": page * limit < total,
            "has_prev": page > 1,
            "data": paths_data,
        }

    except Exception as e:

        logger.exception(
            "Get learning paths error: %s",
            e
        )

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch learning paths",
        )


# ============================================================================
# GET LEARNING PATH BY ID
# ============================================================================

@router.get(
    "/{path_id}",
    response_model=LearningPathDetailResponse,
    responses={
        404: {"model": ErrorResponse},
        500: {"model": ErrorResponse},
    },
)
async def get_learning_path_by_id(
    path_id: int,
    current_user: Optional[User] = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Get a single learning path with all modules
    and optional current-user progress.
    """

    try:

        # ------------------------------------------------------------
        # Get learning path
        # ------------------------------------------------------------
        path = (
            db.query(LearningPath)
            .filter(
                LearningPath.id == path_id
            )
            .first()
        )

        if not path:

            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Learning path not found",
            )

        # ------------------------------------------------------------
        # Convert to response
        # ------------------------------------------------------------
        detail = LearningPathDetailResponse.model_validate(path)

        # ------------------------------------------------------------
        # Get modules
        # ------------------------------------------------------------
        modules = (
            db.query(LearningModule)
            .filter(
                LearningModule.learning_path_id
                == path_id
            )
            .order_by(
                LearningModule.module_order
            )
            .all()
        )

        detail.modules = [
            LearningModuleResponse.model_validate(module)
            for module in modules
        ]

        # ------------------------------------------------------------
        # Check current user's progress
        # ------------------------------------------------------------
        if current_user:

            progress = (
                db.query(UserLearningProgress)
                .filter(
                    and_(
                        UserLearningProgress.user_id
                        == current_user.id,

                        UserLearningProgress.learning_path_id
                        == path_id,
                    )
                )
                .first()
            )

            if progress:

                detail.user_progress = {
                    "enrolled": True,
                    "progress_percentage": (
                        progress.progress_percentage
                    ),
                    "modules_completed": (
                        progress.modules_completed
                    ),
                    "started_at": (
                        progress.started_at
                    ),
                    "is_completed": (
                        progress.is_completed
                    ),
                    "certificate_issued": (
                        progress.certificate_issued
                    ),
                }

        return detail

    except HTTPException:
        raise

    except Exception as e:

        logger.exception(
            "Get learning path error: %s",
            e
        )

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch learning path",
        )


# ============================================================================
# ENROLL IN LEARNING PATH
# ============================================================================

@router.post(
    "/{path_id}/enroll",
    response_model=dict,
    responses={
        401: {"model": ErrorResponse},
        404: {"model": ErrorResponse},
        409: {"model": ErrorResponse},
        500: {"model": ErrorResponse},
    },
)
async def enroll_learning_path(
    path_id: int,
    request: LearningPathEnrollRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Enroll authenticated user in a learning path.

    Features preserved:
    - Path validation
    - Duplicate enrollment prevention
    - Progress record creation
    - Enrollment counter update
    """

    try:

        # ------------------------------------------------------------
        # Get learning path
        # ------------------------------------------------------------
        path = (
            db.query(LearningPath)
            .filter(
                LearningPath.id == path_id
            )
            .first()
        )

        if not path:

            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Learning path not found",
            )

        # ------------------------------------------------------------
        # Check existing enrollment
        # ------------------------------------------------------------
        existing = (
            db.query(UserLearningProgress)
            .filter(
                and_(
                    UserLearningProgress.user_id
                    == current_user.id,

                    UserLearningProgress.learning_path_id
                    == path_id,
                )
            )
            .first()
        )

        if existing:

            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Already enrolled in this path",
            )

        # ------------------------------------------------------------
        # Create progress/enrollment record
        # ------------------------------------------------------------
        progress = UserLearningProgress(
            user_id=current_user.id,
            learning_path_id=path_id,
            progress_percentage=0,
            modules_completed=0,
            started_at=datetime.utcnow(),
        )

        # ------------------------------------------------------------
        # FIX:
        # Safely increment enrollments even when NULL
        # ------------------------------------------------------------
        path.enrollments = (
            (path.enrollments or 0) + 1
        )

        # ------------------------------------------------------------
        # Save
        # ------------------------------------------------------------
        db.add(progress)
        db.commit()

        # Refresh objects after commit
        db.refresh(progress)
        db.refresh(path)

        logger.info(
            "User %s enrolled in path %s",
            current_user.id,
            path_id,
        )

        return {
            "message": "Successfully enrolled in learning path",
            "path_id": path_id,
        }

    except HTTPException:
        raise

    except Exception as e:

        db.rollback()

        logger.exception(
            "Enroll learning path error: %s",
            e
        )

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to enroll in learning path",
        )


# ============================================================================
# UPDATE LEARNING PATH PROGRESS
# ============================================================================

@router.put(
    "/{path_id}/progress",
    response_model=dict,
    responses={
        401: {"model": ErrorResponse},
        404: {"model": ErrorResponse},
        409: {"model": ErrorResponse},
        500: {"model": ErrorResponse},
    },
)
async def update_learning_progress(
    path_id: int,
    request: LearningPathProgressRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Update user's learning path progress.

    Features preserved:
    - Enrollment validation
    - Progress update
    - Completion detection
    - Certificate issuance
    - Leaderboard points
    """

    try:

        # ------------------------------------------------------------
        # Get progress
        # ------------------------------------------------------------
        progress = (
            db.query(UserLearningProgress)
            .filter(
                and_(
                    UserLearningProgress.user_id
                    == current_user.id,

                    UserLearningProgress.learning_path_id
                    == path_id,
                )
            )
            .first()
        )

        if not progress:

            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Not enrolled in this path",
            )

        # ------------------------------------------------------------
        # Update progress
        # ------------------------------------------------------------
        progress.progress_percentage = (
            request.progress_percentage
        )

        progress.modules_completed = (
            request.modules_completed
        )

        progress.updated_at = datetime.utcnow()

        # ------------------------------------------------------------
        # Get learning path
        # ------------------------------------------------------------
        path = (
            db.query(LearningPath)
            .filter(
                LearningPath.id == path_id
            )
            .first()
        )

        if not path:

            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Learning path not found",
            )

        # ------------------------------------------------------------
        # Completion handling
        # ------------------------------------------------------------
        if (
            request.progress_percentage == 100
            and not progress.is_completed
        ):

            progress.is_completed = True

            progress.completed_at = (
                datetime.utcnow()
            )

            # --------------------------------------------------------
            # Issue certificate
            # --------------------------------------------------------
            progress.certificate_issued = True

            # --------------------------------------------------------
            # Award leaderboard points
            # --------------------------------------------------------
            leaderboard = (
                db.query(Leaderboard)
                .filter(
                    Leaderboard.user_id
                    == current_user.id
                )
                .first()
            )

            if leaderboard:

                leaderboard.total_points = (
                    (leaderboard.total_points or 0)
                    + 50
                )

                leaderboard.last_activity = (
                    datetime.utcnow()
                )

        # ------------------------------------------------------------
        # Commit
        # ------------------------------------------------------------
        db.commit()

        # ------------------------------------------------------------
        # Refresh
        # ------------------------------------------------------------
        db.refresh(progress)

        logger.info(
            "Progress updated for user %s in path %s",
            current_user.id,
            path_id,
        )

        return {
            "message": "Progress updated successfully",
            "progress_percentage": (
                progress.progress_percentage
            ),
            "modules_completed": (
                progress.modules_completed
            ),
            "is_completed": (
                progress.is_completed
            ),
            "certificate_issued": (
                progress.certificate_issued
            ),
        }

    except HTTPException:
        raise

    except Exception as e:

        db.rollback()

        logger.exception(
            "Update learning progress error: %s",
            e
        )

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update progress",
        )