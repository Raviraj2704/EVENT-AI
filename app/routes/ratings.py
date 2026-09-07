# ============================================================================
# Rating Routes
# ============================================================================
# File: app/routes/ratings.py
# Purpose: Rating analytics and dashboard endpoints
# Status: Production-Ready
# ============================================================================

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
import logging

from app.database import get_db
from app.models import Rating, RatingType
from app.schemas import (
    RatingResponse,
    RatingDistribution,
    RatingDashboardResponse,
    ErrorResponse
)
from app.routes.users import get_current_user


logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/api/v1/ratings",
    tags=["Ratings"]
)


# ============================================================================
# GET ALL RATINGS
# ============================================================================

@router.get(
    "",
    response_model=dict
)
async def get_ratings(
    db: Session = Depends(get_db)
):
    """
    Get latest ratings.

    Returns maximum 50 ratings ordered by newest first.
    """

    try:
        ratings = (
            db.query(Rating)
            .order_by(Rating.created_at.desc())
            .limit(50)
            .all()
        )

        ratings_data = [
            RatingResponse.model_validate(rating)
            for rating in ratings
        ]

        return {
            "total": len(ratings_data),
            "data": ratings_data
        }

    except Exception as e:

        logger.exception(
            "Get ratings error: %s",
            e
        )

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch ratings"
        )


# ============================================================================
# GET RATING DASHBOARD
# ============================================================================

@router.get(
    "/dashboard/overview",
    response_model=dict
)
async def get_rating_dashboard(
    db: Session = Depends(get_db)
):
    """
    Get rating dashboard with aggregated statistics.
    """

    try:

        all_ratings = (
            db.query(Rating)
            .order_by(Rating.created_at.desc())
            .all()
        )

        # --------------------------------------------------------------------
        # Overall statistics
        # --------------------------------------------------------------------

        total_ratings = len(all_ratings)

        average_rating = (
            sum(r.score for r in all_ratings) / total_ratings
            if total_ratings > 0
            else 0
        )

        # --------------------------------------------------------------------
        # Rating distribution
        # --------------------------------------------------------------------

        distribution = {
            "five_stars": sum(
                1 for r in all_ratings if r.score == 5
            ),
            "four_stars": sum(
                1 for r in all_ratings if r.score == 4
            ),
            "three_stars": sum(
                1 for r in all_ratings if r.score == 3
            ),
            "two_stars": sum(
                1 for r in all_ratings if r.score == 2
            ),
            "one_star": sum(
                1 for r in all_ratings if r.score == 1
            )
        }

        # --------------------------------------------------------------------
        # Recent ratings
        # --------------------------------------------------------------------

        recent_ratings = (
            db.query(Rating)
            .order_by(Rating.created_at.desc())
            .limit(10)
            .all()
        )

        recent_data = [
            RatingResponse.model_validate(r)
            for r in recent_ratings
        ]

        # --------------------------------------------------------------------
        # Ratings by type
        # --------------------------------------------------------------------

        ratings_by_type = {}

        for rating_type in RatingType:

            type_ratings = [
                r
                for r in all_ratings
                if r.rating_type == rating_type
            ]

            count = len(type_ratings)

            average = (
                sum(r.score for r in type_ratings) / count
                if count > 0
                else 0
            )

            ratings_by_type[rating_type.value] = {
                "count": count,
                "average": round(average, 2)
            }

        # --------------------------------------------------------------------
        # Response
        # --------------------------------------------------------------------

        return {
            "summary": {
                "total_ratings": total_ratings,
                "average_rating": round(average_rating, 2),
                "distribution": distribution
            },
            "by_type": ratings_by_type,
            "recent_feedback": recent_data,
            "charts": {
                "distribution": distribution,
                "by_type": ratings_by_type
            }
        }

    except Exception as e:

        logger.exception(
            "Get rating dashboard error: %s",
            e
        )

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch dashboard"
        )


# ============================================================================
# GET RATINGS BY ENTITY TYPE
# ============================================================================

@router.get(
    "/entity/{entity_type}",
    response_model=dict
)
async def get_ratings_by_type(
    entity_type: str,
    db: Session = Depends(get_db)
):
    """
    Get ratings filtered by entity type.

    Supported:
        session
        speaker
        resource
        event
        experience
        partner
    """

    try:

        # --------------------------------------------------------------------
        # Normalize input
        # --------------------------------------------------------------------

        entity_type = entity_type.strip().lower()

        # --------------------------------------------------------------------
        # Entity mapping
        # --------------------------------------------------------------------

        rating_type_map = {
            "session": RatingType.SESSION,
            "speaker": RatingType.SPEAKER,
            "resource": RatingType.RESOURCE,
            "event": RatingType.EVENT,
            "experience": RatingType.EXPERIENCE,
            "partner": RatingType.PARTNER
        }

        if entity_type not in rating_type_map:

            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=(
                    "Invalid entity type. "
                    "Supported types: "
                    "session, speaker, resource, event, "
                    "experience, partner"
                )
            )

        rating_type = rating_type_map[entity_type]

        # --------------------------------------------------------------------
        # Fetch ratings
        # --------------------------------------------------------------------

        ratings = (
            db.query(Rating)
            .filter(
                Rating.rating_type == rating_type
            )
            .order_by(
                Rating.created_at.desc()
            )
            .all()
        )

        # --------------------------------------------------------------------
        # Statistics
        # --------------------------------------------------------------------

        total = len(ratings)

        average = (
            sum(r.score for r in ratings) / total
            if total > 0
            else 0
        )

        distribution = {
            "five_stars": sum(
                1 for r in ratings if r.score == 5
            ),
            "four_stars": sum(
                1 for r in ratings if r.score == 4
            ),
            "three_stars": sum(
                1 for r in ratings if r.score == 3
            ),
            "two_stars": sum(
                1 for r in ratings if r.score == 2
            ),
            "one_star": sum(
                1 for r in ratings if r.score == 1
            )
        }

        # --------------------------------------------------------------------
        # Recent ratings
        # --------------------------------------------------------------------

        ratings_data = [
            RatingResponse.model_validate(r)
            for r in ratings[:20]
        ]

        # --------------------------------------------------------------------
        # Response
        # --------------------------------------------------------------------

        return {
            "entity_type": entity_type,
            "total": total,
            "average": round(average, 2),
            "distribution": distribution,
            "recent": ratings_data
        }

    except HTTPException:
        raise

    except Exception as e:

        logger.exception(
            "Get ratings by type error: %s",
            e
        )

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch ratings"
        )