import request from 'supertest'
import { describe, expect, it } from 'vitest'

import server from '../server.js'

describe('Application routes', () => {
  it('should return the home route', async () => {
    const response = await request(server).get('/')

    expect(response.status).toBe(200)
    expect(response.body).toEqual({
      message: 'This is the home route',
    })
  })

  it('should return 404 for an unknown route', async () => {
    const response = await request(server).get('/unknown-route')

    expect(response.status).toBe(404)
    expect(response.body).toEqual({
      success: false,
      message: 'Route not found',
    })
  })
})
