# DotExpander

DotExpander is a powerful Chrome extension that enhances your typing efficiency through customizable text expansion, rich text snippets, and dynamic macros.

## Key Features

### 📝 Text Snippets
- Create and manage text snippets with custom abbreviations
- Case-insensitive snippet names (e.g., "brb", "BRB", "bRb" all work)
- Organize snippets in folders for better management
- Import/Export functionality for backup and sharing
- Rich text editor support with table functionality

### ⚡ Smart Expansion Methods
- Hotkey expansion (default: Shift+Space)
- Dot phrases: Type "." followed by snippet name (optional feature)
- Context menu integration

### 🔄 Dynamic Content
- **Placeholders**: Insert dynamic values with `%text%` format
- **Date/Time Macros**: Insert current date/time with various formats
- **Math Calculations**: Perform calculations inline with `[[expression=]]`
- **Clipboard Integration**: Paste clipboard content using `[[%p]]`
- **Browser URL Macros**: Insert current webpage URL or its components
- **Snippet Embedding**: Include one snippet inside another

### 💾 Storage & Sync
- Multiple storage modes for your data
- Cross-device synchronization through Chrome sync
- Automatic backup and revision history
- CSV import/export support

### 🎨 Customization
- Configurable hotkeys
- Auto-insert character pairs
- Custom snippet delimiters
- Dark mode support
- Site blocking for incompatible websites

### 🛠️ Advanced Features
- Date/Time arithmetic for complex date calculations
- Rich text HTML support
- System variable integration
- Comprehensive search functionality

## Installation

Install DotExpander from the [Chrome Web Store](https://chrome.google.com/webstore/detail/dotexpander/ekfnbpgmmeahnnlpjibofkobpdkifapn)

## Usage Examples

1. **Basic Snippet**:
   - Create a snippet with name "brb"
   - Set its content to "be right back"
   - Type "brb" and press Shift+Space to expand

2. **Dynamic Placeholder**:
   - Create a snippet "wishBDay" with content "Happy Birthday %name%!"
   - When used, %name% will be highlighted for you to type the person's name

3. **Date Macro**:
   - Use `[[%d(YYYY-MM-DD)]]` in a snippet to insert current date
   - Supports various formats and arithmetic (e.g., `[[%d(D+5)]]` for 5 days ahead)

4. **Math Calculations**:
   - Type `[[5^3=]]` to calculate 5 cubed
   - Supports basic operations (+, -, *, /, ^) and parentheses

## Support

For issues, feature requests, or general feedback:
- Email: james@doctordurant.com
- [Submit a Review](https://chrome.google.com/webstore/detail/dotexpander/ekfnbpgmmeahnnlpjibofkobpdkifapn/reviews)
- [Report Issues](https://chrome.google.com/webstore/detail/dotexpander/ekfnbpgmmeahnnlpjibofkobpdkifapn/support)

## Attribution

DotExpander is based on ProKeys by Gaurang Tandon, modified and enhanced by DoctorDuRant LLC with permission. Enhancements include:
- Updated to Manifest V3 compatibility
- Enhanced rich text editor support
- Improved storage management
- Modern UI/UX improvements

## License

ISC License - See LICENSE.md for details

---
© 2025 James M DuRant III MD MBA | [GitHub Repository](https://github.com/jmdurant/dotexpander)
