# Testing Instructions - Retro African Safari Dash

This document provides instructions for testing the "Retro African Safari Dash" game developed for the AWS Amazon Q "That's Entertainment!" challenge.

## Game URL

The game is available at: [https://d33ejg1jsmvn6g.cloudfront.net](https://d33ejg1jsmvn6g.cloudfront.net)

## Testing Credentials

As requested, use the following credentials to test the game:

### Admin
- **Username**: admin
- **Password**: 2025DEVChallenge

### User
- **Username**: newuser
- **Password**: 2025DEVChallenge

## Step-by-Step Testing Instructions

### 1. Main Menu Test
1. Access the game URL
2. Verify that the main menu displays with the title "RETRO AFRICAN SAFARI DASH"
3. Check if the "START GAME" and "CREDITS" buttons are working

### 2. Gameplay Test
1. Click "START GAME" to start the game
2. Use the arrow keys to move the character
3. Try to collect artifacts (yellow objects) to gain points
4. Try to avoid obstacles (red objects) to prevent losing lives
5. Observe if the score increases when collecting artifacts
6. Observe if the number of lives decreases when colliding with obstacles
7. Press ESC to pause the game and verify if the pause menu appears

### 3. Scoring System Test
1. Play until you lose all lives or press ESC and choose "QUIT GAME"
2. On the Game Over screen, observe your final score
3. Use the testing credentials to submit your score:
   - For admin: username: admin, password: 2025DEVChallenge
   - For user: username: newuser, password: 2025DEVChallenge
4. Verify if your score appears on the leaderboard

### 4. Leaderboard Test
1. After submitting your score, verify if the leaderboard is displayed
2. Play again and try to get a different score
3. Verify if the leaderboard is correctly updated with your new scores
4. Test with both credentials (admin and user) to check if there are permission differences

### 5. Responsiveness Test
1. Test the game on different screen sizes
2. Verify if the game adapts correctly on mobile devices and desktops

## Reporting Issues

If you encounter any issues during testing, please report with the following information:
1. Problem description
2. Steps to reproduce
3. Expected behavior vs. observed behavior
4. Browser and device used

## Additional Notes

- The game has been optimized for modern browsers (Chrome, Firefox, Safari, Edge)
- For the best experience, we recommend playing on a desktop with a keyboard
- The game backend is serverless, using AWS Lambda, API Gateway, and DynamoDB
