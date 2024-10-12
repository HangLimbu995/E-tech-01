import bcrypt from 'bcryptjs'

const hashedPassowrd = async (password) => {
    const salt = await bcrypt.getSalt(10)
    const hasnedPassword = await bcrypt.hash(password, salt)

    return hasnedPassword
}