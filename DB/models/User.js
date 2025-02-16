import { model, Schema } from "mongoose";
import bcryptjs from "bcryptjs";
export const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      min: 3,
      max: 20,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    gender: {
      type: String,
      enum: ["male", "female"],
      required:true
    },
    phone: {
      type: String,
    },
    forgetCode: String,

    isConfirmed: {
      type: Boolean,
      default: false,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      enum: ["admin", "customer"],
      default: "customer",
    },
    address: {
      type: String,
      
    },
    orders: [
      {
        type: Schema.Types.ObjectId,
        ref: "Order",
      },
    ],
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", function () {
  if (this.isModified("password")) {
    this.password = bcryptjs.hashSync(
      this.password,
      parseFloat(process.env.SALT_ROUND)
    );
  }
});

export const User = model("User", userSchema);
