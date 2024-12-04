# Movie Explorer App 

A React Native mobile application for exploring movies, built with Expo and TypeScript. Browse popular movies, search for specific titles, view detailed information, and manage your favorite movies.

## Features 

- Browse popular movies
- Search movies by title
- View detailed movie information
- Rate movies
- Save favorites
- Beautiful, responsive UI

## Tech Stack 

- React Native
- Expo SDK 52.0.0
- TypeScript
- Redux Toolkit (State Management)
- React Navigation
- The Movie Database (TMDB) API
- Axios for API calls

## Prerequisites 

- Node.js (v18 or newer)
- npm or yarn
- Expo CLI
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)

## Installation 

1. Clone the repository:
   ```bash
   git clone [your-repo-url]
   cd hello-world-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with your TMDB API key:
   ```
   TMDB_API_KEY=your_api_key_here
   TMDB_BASE_URL=https://api.themoviedb.org/3
   TMDB_IMAGE_BASE_URL=https://image.tmdb.org/t/p
   ```

## Running the App 

1. Start the development server:
   ```bash
   npx expo start
   ```

2. Run on specific platform:
   - Press `i` for iOS

## Development 

- `app/` - Main application code
- `components/` - Reusable React components
- `store/` - Redux store configuration and slices
- `hooks/` - Custom React hooks
- `types/` - TypeScript type definitions

## Environment Setup 


### iOS Development
1. Install Xcode
2. Install CocoaPods
3. Configure iOS Simulator

## Contributing 

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License 

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments 

- [The Movie Database (TMDB)](https://www.themoviedb.org/) for providing the movie data API
- [Expo](https://expo.dev/) for the amazing React Native development platform
- All the open-source libraries used in this project
