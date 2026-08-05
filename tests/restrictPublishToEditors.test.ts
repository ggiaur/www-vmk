import { describe, expect, it } from 'vitest'
import { restrictPublishToEditors } from '../src/lib/access'

type FakeArgs = Parameters<typeof restrictPublishToEditors>[0]

function makeArgs(status: string, role: string | undefined): FakeArgs {
  return {
    data: { _status: status },
    req: { user: role ? { role } : undefined },
  } as unknown as FakeArgs
}

describe('restrictPublishToEditors', () => {
  it('blocks an author from publishing', () => {
    expect(() => restrictPublishToEditors(makeArgs('published', 'author'))).toThrow()
  })

  it('blocks an unauthenticated request from publishing', () => {
    expect(() => restrictPublishToEditors(makeArgs('published', undefined))).toThrow()
  })

  it('allows an author to save a draft', () => {
    expect(() => restrictPublishToEditors(makeArgs('draft', 'author'))).not.toThrow()
  })

  it('allows an editor to publish', () => {
    expect(() => restrictPublishToEditors(makeArgs('published', 'editor'))).not.toThrow()
  })

  it('allows an admin to publish', () => {
    expect(() => restrictPublishToEditors(makeArgs('published', 'admin'))).not.toThrow()
  })

  it('returns the data unchanged when allowed', () => {
    const args = makeArgs('draft', 'author')
    expect(restrictPublishToEditors(args)).toBe(args.data)
  })
})
