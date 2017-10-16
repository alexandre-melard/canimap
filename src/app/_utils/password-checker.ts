export function scorePassword(pass) {
    let score = 0;
    if (!pass) {
        return score;
    }

    // award every unique letter until 5 repetitions
    const letters = new Object();
    for (let i = 0; i < pass.length; i++) {
        letters[pass[i]] = (letters[pass[i]] || 0) + 1;
        score += 5.0 / letters[pass[i]];
    }

    // bonus points for mixing it up
    const variations = {
        digits: /\d/.test(pass),
        lower: /[a-z]/.test(pass),
        upper: /[A-Z]/.test(pass),
        nonWords: /\W/.test(pass),
    };

    let variationCount = 0;
    for (const check in variations) {
        if (variations[check]) {
            variationCount += (variations[check] === true) ? 1 : 0;
        }
    }
    score += (variationCount - 1) * 10;

    return score;
}

export function checkPassword(password: string, password2: string) {
    let success = '';
    let error = '';
    if (password === password2) {
        const score = scorePassword(password);
        if (score < 30) {
            error = 'Le mot de passe est trop simple à trouver, veuillez en entrer un nouveau.';
        } else {
            let message = 'Mot de passe modifié, il est de ';
            if (score > 80) {
                message += ' très bonne qualité.';
            } else if (score > 60) {
                message += 'bonne qualité';
            } else {
                message += ' qualité moyenne';
            }
            success = message;
        }
    } else {
        error = 'Les mots de passes doivent être identiques';
    }
    return { success: success, error: error };
}
