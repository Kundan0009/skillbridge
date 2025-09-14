# Contributing to SkillBridge

Thank you for your interest in contributing to SkillBridge! This document provides guidelines and information for contributors.

## 🤝 How to Contribute

### Types of Contributions
- 🐛 Bug reports and fixes
- ✨ New features and enhancements
- 📚 Documentation improvements
- 🎨 UI/UX improvements
- 🧪 Tests and quality assurance
- 🌐 Translations and localization

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- Google Gemini API key
- Git knowledge

### Development Setup
1. **Fork the repository**
   ```bash
   git clone https://github.com/yourusername/skillbridge.git
   cd skillbridge
   ```

2. **Install dependencies**
   ```bash
   # Backend
   cd server
   npm install
   
   # Frontend
   cd ../client
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Copy example files
   cp server/.env.example server/.env
   cp client/.env.example client/.env
   ```

4. **Start development servers**
   ```bash
   # Terminal 1 - Backend
   cd server
   npm run dev
   
   # Terminal 2 - Frontend
   cd client
   npm start
   ```

## 📋 Development Guidelines

### Code Style
- **JavaScript**: Use ES6+ features
- **React**: Functional components with hooks
- **CSS**: Tailwind CSS classes preferred
- **Naming**: camelCase for variables, PascalCase for components

### File Structure
```
skillbridge/
├── server/
│   ├── controllers/     # Route handlers
│   ├── middleware/      # Custom middleware
│   ├── models/         # Database models
│   ├── routes/         # API routes
│   └── config/         # Configuration files
├── client/
│   ├── src/
│   │   ├── components/ # React components
│   │   ├── pages/      # Page components
│   │   └── utils/      # Utility functions
│   └── public/         # Static assets
└── docs/              # Documentation
```

### Commit Messages
Use conventional commit format:
```
type(scope): description

feat(auth): add password reset functionality
fix(upload): resolve file size validation issue
docs(api): update endpoint documentation
style(ui): improve button hover effects
```

### Branch Naming
- `feature/feature-name` - New features
- `fix/bug-description` - Bug fixes
- `docs/update-readme` - Documentation updates
- `refactor/component-name` - Code refactoring

## 🐛 Reporting Issues

### Bug Reports
When reporting bugs, please include:
- **Description**: Clear description of the issue
- **Steps to Reproduce**: Detailed steps to recreate the bug
- **Expected Behavior**: What should happen
- **Actual Behavior**: What actually happens
- **Environment**: OS, browser, Node.js version
- **Screenshots**: If applicable

### Feature Requests
For new features, please provide:
- **Problem Statement**: What problem does this solve?
- **Proposed Solution**: How should it work?
- **Alternatives**: Other solutions considered
- **Additional Context**: Any other relevant information

## 🔧 Development Process

### 1. Issue Assignment
- Check existing issues before creating new ones
- Comment on issues you'd like to work on
- Wait for assignment before starting work

### 2. Development
- Create a new branch from `main`
- Make your changes following the guidelines
- Write tests for new functionality
- Update documentation as needed

### 3. Testing
```bash
# Run backend tests
cd server
npm test

# Run frontend tests
cd client
npm test

# Run linting
npm run lint
```

### 4. Pull Request
- Push your branch to your fork
- Create a pull request to the main repository
- Fill out the PR template completely
- Link related issues

## 📝 Pull Request Guidelines

### PR Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Refactoring

## Testing
- [ ] Tests pass locally
- [ ] New tests added (if applicable)
- [ ] Manual testing completed

## Screenshots
(If applicable)

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No breaking changes
```

### Review Process
1. **Automated Checks**: CI/CD pipeline runs tests
2. **Code Review**: Maintainers review the code
3. **Feedback**: Address any requested changes
4. **Approval**: PR approved by maintainers
5. **Merge**: Changes merged to main branch

## 🧪 Testing Guidelines

### Backend Testing
```javascript
// Example test structure
describe('Resume Analysis', () => {
  test('should analyze PDF resume', async () => {
    // Test implementation
  });
});
```

### Frontend Testing
```javascript
// Component testing with React Testing Library
import { render, screen } from '@testing-library/react';
import Dashboard from './Dashboard';

test('renders dashboard correctly', () => {
  render(<Dashboard />);
  expect(screen.getByText('SkillBridge')).toBeInTheDocument();
});
```

### Manual Testing Checklist
- [ ] User registration and login
- [ ] Resume upload and analysis
- [ ] Results display correctly
- [ ] Navigation works properly
- [ ] Responsive design on mobile
- [ ] Error handling works

## 📚 Documentation

### Code Documentation
- Use JSDoc for functions and classes
- Comment complex logic
- Keep comments up to date

### API Documentation
- Update API_DOCUMENTATION.md for new endpoints
- Include request/response examples
- Document error codes

### User Documentation
- Update USER_GUIDE.md for new features
- Include screenshots for UI changes
- Keep installation instructions current

## 🌟 Recognition

### Contributors
All contributors will be:
- Listed in the README.md
- Credited in release notes
- Invited to the contributors team

### Contribution Types
We recognize various types of contributions:
- 💻 Code
- 📖 Documentation
- 🐛 Bug reports
- 💡 Ideas
- 🎨 Design
- 📹 Videos/Tutorials

## 📞 Getting Help

### Communication Channels
- **GitHub Issues**: For bugs and feature requests
- **GitHub Discussions**: For questions and ideas
- **Email**: For private matters

### Mentorship
New contributors can request mentorship for:
- First-time contributions
- Complex features
- Architecture decisions
- Best practices

## 📄 License

By contributing to SkillBridge, you agree that your contributions will be licensed under the MIT License.

## 🙏 Thank You

Thank you for contributing to SkillBridge! Your efforts help make resume analysis accessible to students worldwide.

---

**Happy Contributing! 🚀**