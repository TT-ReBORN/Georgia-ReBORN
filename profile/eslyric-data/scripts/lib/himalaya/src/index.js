import lexer from './lexer.js'
import parser from './parser.js'
import {format} from './format.js'
import {toHTML} from './stringify.js'
import {
  voidTags,
  closingTags,
  childlessTags,
  closingTagAncestorBreakers
} from './tags.js'

export const parseDefaults = {
  voidTags,
  closingTags,
  childlessTags,
  closingTagAncestorBreakers,
  includePositions: false
}

export function parse (str, options = parseDefaults) {
  const tokens = lexer(str, options)
  const nodes = parser(tokens, options)
  return format(nodes, options)
}

export function stringify (ast, options = parseDefaults) {
  return toHTML(ast, options)
}
