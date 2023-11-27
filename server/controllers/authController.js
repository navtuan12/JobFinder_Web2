import Users from "../models/userModel.js";
import { sendVerificationEmail } from "../utils/sendEmail.js";

export const register = async (req, res, next) => {
  const { firstName, lastName, email, password } = req.body;

  //validate fileds

  if (!firstName) {
    next("First Name is required");
    return;
  }
  if (!email) {
    next("Email is required");
    return;
  }
  if (!lastName) {
    next("Last Name is required");
    return;
  }
  if (!password) {
    next("Password is required");
    return;
  }

  try {
    const userExist = await Users.findOne({ email });

    if (userExist) {
      next("Email Address already exists");
      return;
    }

    const user = await Users.create({
      firstName,
      lastName,
      email,
      password,
    });

    // user token
    const token = await user.createJWT();

    //send email verification to user
    sendVerificationEmail(user, res);
    // res.status(201).send({
    //   success: true,
    //   message: "Account created successfully",
    //   user: {
    //     _id: user._id,
    //     firstName: user.firstName,
    //     lastName: user.lastName,
    //     email: user.email,
    //     accountType: user.accountType,
    //   },
    //   token,
    // });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};

export const signIn = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    //validation
    if (!email || !password) {
      next("Please Provide AUser Credentials");
      return;
    }

    // find user by email
    const user = await Users.findOne({ email }).select("+password");

    if (!user) {
      next("Invalid email or password");
      return;
    }
    if (!user?.verified) {
      next(
        "User email is not verified. Check your email account and verify your email"
      );
      return;
    }
    // compare password
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      next("Invalid email or password");
      return;
    }

    user.password = undefined;

    const token = user.createJWT();

    res.status(201).json({
      success: true,
      message: "Login successfully",
      user,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};
