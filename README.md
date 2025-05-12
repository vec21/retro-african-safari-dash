# Retro African Safari Dash

A retro-style, 8-bit arcade game where players control a character navigating an African savanna, collecting cultural artifacts while avoiding obstacles. Built for the AWS Amazon Q Developer Challenge "That's Entertainment!".

## Project Overview

This project demonstrates how Amazon Q Developer can be used to create an entertaining retro-style game with AWS infrastructure. The game features:

- 8-bit pixel art aesthetic inspired by 90s arcade games
- Player movement with arrow keys
- Collectible artifacts that increase score
- Obstacles to avoid
- Leaderboard system using DynamoDB
- Serverless backend with AWS Lambda and API Gateway

## Architecture

The project uses the following AWS services:

- **S3**: Hosts the static game files (HTML, CSS, JavaScript, assets)
- **CloudFront**: Provides CDN for fast content delivery
- **DynamoDB**: Stores leaderboard data
- **Lambda**: Processes score submissions and retrieves leaderboard data
- **API Gateway**: Provides RESTful API endpoints for the game

## How Amazon Q Developer Was Used

Amazon Q Developer was instrumental in creating this project:

1. **Infrastructure as Code**: Generated and modified Pulumi code to provision AWS resources
2. **Game Logic**: Created the core game mechanics using Phaser.js
3. **Backend Development**: Developed Lambda functions for leaderboard functionality
4. **Frontend Integration**: Connected the game to the backend services
5. **Documentation**: Generated comprehensive documentation

## Local Development

### Prerequisites

- Node.js 14+
- Pulumi CLI
- AWS CLI configured with appropriate credentials

### Setup

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/retro-african-safari-dash.git
   cd retro-african-safari-dash
   ```

2. Install dependencies:
   ```
   cd lambda
   npm install
   cd ..
   ```

3. Deploy with Pulumi:
   ```
   pulumi up
   ```

4. After deployment, update the API URL in the game:
   ```
   const apiUrl = 'https://your-api-gateway-url.execute-api.region.amazonaws.com/v1/leaderboard';
   ```

## Testing Credentials

As required by the challenge, you can use these credentials for testing:

- Admin:
  - username: admin
  - password: 2025DEVChallenge
- User:
  - username: newuser
  - password: 2025DEVChallenge

## Game Controls

- **Arrow Keys**: Move the player character
- **Space/Enter**: Start game / Submit score

## Future Enhancements

- Add sound effects and background music
- Implement different levels with increasing difficulty
- Add more variety of artifacts and obstacles
- Implement user authentication for persistent player profiles

## License

MIT

## Acknowledgements

- Created with Amazon Q Developer for the AWS Challenge
- Built using Phaser.js game framework
- Infrastructure managed with Pulumi
