/**
 * Configuração da API para o jogo Retro African Safari Dash
 * Este arquivo será atualizado automaticamente após o deploy com Pulumi
 */

// Configurar a URL da API após o deploy
window.addEventListener('DOMContentLoaded', function() {
    if (typeof apiConfig !== 'undefined') {
        // Substituir com a URL real após o deploy
        const apiUrl = 'https://k782z3n7ah.execute-api.us-west-2.amazonaws.com/v1/leaderboard';
        
        if (apiUrl && apiUrl !== 'https://k782z3n7ah.execute-api.us-west-2.amazonaws.com/v1/leaderboard') {
            apiConfig.setApiUrl(apiUrl);
        } else {
            console.log('URL da API não configurada. Usando armazenamento local.');
        }
    }
});
