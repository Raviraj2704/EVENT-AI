import { useState, useCallback } from 'react'
import apiClient from '../config/apiClient'

export const useApi = (url, options = {}) => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const request = useCallback(async (config = {}) => {
    setLoading(true)
    setError(null)

    try {
      const response = await apiClient.get(url, {
        ...options,
        ...config
      })
      setData(response.data)
      return response.data
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'An error occurred'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }, [url, options])

  const refetch = useCallback(() => {
    return request()
  }, [request])

  return {
    data,
    loading,
    error,
    request,
    refetch
  }
}

export default useApi
