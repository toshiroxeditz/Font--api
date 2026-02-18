const fonts = require('../fonts');

const fontList = [
  { id: 'script', name: 'Script', category: 'Script' },
  { id: 'boldScript', name: 'Bold Script', category: 'Script' },
  { id: 'sans', name: 'Sans Serif', category: 'Sans' },
  { id: 'boldSans', name: 'Bold Sans', category: 'Sans' },
  { id: 'italicSans', name: 'Italic Sans', category: 'Sans' },
  { id: 'boldItalicSans', name: 'Bold Italic Sans', category: 'Sans' },
  { id: 'serif', name: 'Serif', category: 'Serif' },
  { id: 'boldSerif', name: 'Bold Serif', category: 'Serif' },
  { id: 'mono', name: 'Monospace', category: 'Mono' },
  { id: 'doubleStruck', name: 'Double Struck', category: 'Math' },
  { id: 'fraktur', name: 'Fraktur', category: 'Gothic' },
  { id: 'boldFraktur', name: 'Bold Fraktur', category: 'Gothic' },
  { id: 'circled', name: 'Circled', category: 'Decorative' },
  { id: 'squared', name: 'Squared', category: 'Decorative' },
  { id: 'negativeSquared', name: 'Negative Squared', category: 'Decorative' },
  { id: 'parenthesized', name: 'Parenthesized', category: 'Decorative' },
  { id: 'smallCaps', name: 'Small Caps', category: 'Small' },
  { id: 'superscript', name: 'Superscript', category: 'Small' },
  { id: 'subscript', name: 'Subscript', category: 'Small' },
  { id: 'wide', name: 'Wide', category: 'Wide' },
  { id: 'vaporwave', name: 'Vaporwave', category: 'Aesthetic' },
  { id: 'spaced', name: 'Spaced', category: 'Aesthetic' },
  { id: 'bubble', name: 'Bubble', category: 'Bubble' },
  { id: 'blackBubble', name: 'Black Bubble', category: 'Bubble' },
  { id: 'strikethrough', name: 'Strikethrough', category: 'Lines' },
  { id: 'underline', name: 'Underline', category: 'Lines' },
  { id: 'doubleUnderline', name: 'Double Underline', category: 'Lines' },
  { id: 'slash', name: 'Slash', category: 'Lines' },
  { id: 'inverted', name: 'Inverted', category: 'Flip' },
  { id: 'reversed', name: 'Reversed', category: 'Flip' },
  { id: 'asian', name: 'Asian', category: 'Asian' },
  { id: 'asian2', name: 'Asian 2', category: 'Asian' },
  { id: 'asian3', name: 'Asian 3', category: 'Asian' },
  { id: 'asian4', name: 'Asian 4', category: 'Asian' },
  { id: 'asian5', name: 'Asian 5', category: 'Asian' },
  { id: 'curly', name: 'Curly', category: 'Fancy' },
  { id: 'curly2', name: 'Curly 2', category: 'Fancy' },
  { id: 'fancy', name: 'Fancy', category: 'Fancy' },
  { id: 'fancy2', name: 'Fancy 2', category: 'Fancy' },
  { id: 'fancy3', name: 'Fancy 3', category: 'Fancy' },
  { id: 'fancy4', name: 'Fancy 4', category: 'Fancy' },
  { id: 'fancy5', name: 'Fancy 5', category: 'Fancy' },
  { id: 'oldEnglish', name: 'Old English', category: 'Classic' },
  { id: 'medieval', name: 'Medieval', category: 'Classic' },
  { id: 'dotted', name: 'Dotted', category: 'Accents' },
  { id: 'dotted2', name: 'Dotted 2', category: 'Accents' },
  { id: 'lined', name: 'Lined', category: 'Accents' },
  { id: 'lined2', name: 'Lined 2', category: 'Accents' },
  { id: 'greek', name: 'Greek', category: 'Style' },
  { id: 'symbols', name: 'Symbols', category: 'Special' },
  { id: 'currency', name: 'Currency', category: 'Special' },
  { id: 'brackets', name: 'Brackets', category: 'Special' },
  { id: 'paranormal', name: 'Paranormal', category: 'Special' },
  { id: 'squareHollow', name: 'Square Hollow', category: 'Blocks' },
  { id: 'squareFilled', name: 'Square Filled', category: 'Blocks' },
  { id: 'roundHollow', name: 'Round Hollow', category: 'Blocks' },
  { id: 'roundFilled', name: 'Round Filled', category: 'Blocks' },
  { id: 'emoji', name: 'Emoji', category: 'Emoji' },
  { id: 'emoji2', name: 'Emoji 2', category: 'Emoji' }
];

function transform(text, fontName) {
  const font = fonts[fontName];
  if (!font) return null;
  return text.split('').map(char => font[char] || font[char.toLowerCase()] || font[char.toUpperCase()] || char).join('');
}

module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { text, font, list, all, category } = req.query;
  
  if (list === 'true') {
    const listWithPreviews = fontList.map(f => ({ ...f, preview: transform('Hello', f.id) }));
    if (category) {
      return res.json({ count: listWithPreviews.filter(f => f.category.toLowerCase() === category.toLowerCase()).length, fonts: listWithPreviews.filter(f => f.category.toLowerCase() === category.toLowerCase()) });
    }
    return res.json({ count: fontList.length, fonts: listWithPreviews, categories: [...new Set(fontList.map(f => f.category))] });
  }
  
  if (all === 'true' && text) {
    const previews = {};
    Object.keys(fonts).forEach(key => { previews[key] = transform(text, key); });
    return res.json({ original: text, count: Object.keys(fonts).length, fonts: previews });
  }
  
  if (!text) return res.status(400).json({ error: 'Missing text parameter', usage: { single: '/api?text=Hello&font=boldSans', list: '/api?list=true', all: '/api?text=Hello&all=true' } });
  
  if
