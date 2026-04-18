export const isAdmin = (userRole: string) => {
    const allowedRoles = ['superadmin']
    return allowedRoles.includes(userRole)
}
