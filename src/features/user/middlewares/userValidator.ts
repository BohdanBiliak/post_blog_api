export const validateNewUser = (login: string, email: string, password: string) => {
    const errors: { message: string; field: string }[] = [];
    if (!login || typeof login !== 'string' || login.length < 3) {
        errors.push({ message: "Login must be at least 3 characters long", field: "login" });
    }
    if (!email || typeof email !== 'string' || !email.includes('@')) {
        errors.push({ message: "Invalid email format", field: "email" });
    }
    if (!password || typeof password !== 'string' || password.length < 6) {
        errors.push({ message: "Password must be at least 6 characters long", field: "password" });
    }
    return errors.length > 0 ? { errorsMessages: errors } : null;
};
export const validateLoginInput = (loginOrEmail: string, password: string) => {
    const errors: { message: string; field: string }[] = [];
    if (!loginOrEmail || typeof loginOrEmail !== "string" || loginOrEmail.length < 3) {
        errors.push({ message: "Login or email must be at least 3 characters long", field: "loginOrEmail" });
    }
    if (!password || typeof password !== "string" || password.length < 6) {
        errors.push({ message: "Password must be at least 6 characters long", field: "password" });
    }
    return errors.length > 0 ? errors : null;
};
