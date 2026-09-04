import { useState, useCallback } from 'react'
import apiClient from '../config/apiClient'

export const useApi = () => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const request = useCallback(async ({ url, method = 'GET', data: bodyData = null, config = {} }) => {
    setLoading(true)
    setError(null)

    try {
      const response = await apiClient({
        url,
        method,
        data: bodyData,
        ...config
      })
      setData(response.data)
      return response.data
    } catch (err) {
      const errorMessage = err.response?.data?.detail || err.response?.data?.message || err.message || 'An error occurred'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    data,
    loading,
    error,
    request
  }
}

export default useApi