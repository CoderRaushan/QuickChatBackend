import jwt from 'jsonwebtoken';

// export const generateToken = (user) => {
//   return jwt.sign(
//     { id: user._id, name: user.name, email: user.email, photo: user.photo },
//     process.env.JWT_SECRET,
//     { expiresIn: '7d' }
//   );
// };

export const sendTokenResponse = (user, res) => {
  // const token = generateToken(user);
  res.status(200).json({ message: "User login successfully!", success: true, user });
};
