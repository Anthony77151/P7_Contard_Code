// permet de récuperer la date de création d'un utilisateur et d'un post
export const dateParser = (num) => {
    let options = { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' };

    let time = Date.parse(num);
    let date = new Date(time).toLocaleDateString('fr-FR', options);

    return date.toString();
}

// permet de récuperer la date de création d'un commentaire
export const timestampParser = (num) => {
    let options = { hour: "2-digit", minute: "2-digit", weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };

    let date = new Date(num).toLocaleDateString("fr-FR", options);
    return date.toString();
}

// permet de savoir si ce qu'on cherche n'est pas vide
export const isEmpty = (value) => {
    return (
        value === undefined ||
        value === null ||
        (typeof value === "object" && Object.keys(value).length === 0) ||
        (typeof value === "string" && value.trim().length === 0)
    );
};