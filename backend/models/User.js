import mongoose from "mongoose"
import bcrypt from "bcrypt";

const userSchema= new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true,
        trim: true,
        minlength: 3,
    },
    email:{
        type : String,
        unique : true,
        required : true,
         lowercase: true,   // عشان Ali@x.com و ali@x.com ميبقوش حسابين
        trim: true,
        
    },
    password:{
        type : String,
        required : true,
         minlength: 6,
        select: false,
    },

},{timestamps : true})

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return ;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;