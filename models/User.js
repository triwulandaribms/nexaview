// import mongoose from 'mongoose'
// import bcrypt from 'bcryptjs'

// const UserSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: [true, 'Please provide a name'],
//     maxlength: [50, 'Name cannot be more than 50 characters']
//   },
//   email: {
//     type: String,
//     required: [true, 'Please provide an email'],
//     unique: true,
//     lowercase: true,
//     match: [
//       /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
//       'Please provide a valid email'
//     ]
//   },
//   password: {
//     type: String,
//     required: [true, 'Please provide a password'],
//     minlength: [6, 'Password must be at least 6 characters'],
//     select: false // Don't include password in queries by default
//   },
// }, {
//   timestamps: true
// })

// // Hash password before saving
// UserSchema.pre('save', async function(next) {
//   // Only hash the password if it has been modified (or is new)
//   if (!this.isModified('password')) return next()
  
//   // Hash password with cost of 12
//   this.password = await bcrypt.hash(this.password, 12)
//   next()
// })

// // Instance method to check password
// UserSchema.methods.comparePassword = async function(candidatePassword) {
//   return await bcrypt.compare(candidatePassword, this.password)
// }

// // Static method to find user by email and password
// UserSchema.statics.findByCredentials = async function(email, password) {
//   const user = await this.findOne({ email }).select('+password')
  
//   if (!user) {
//     throw new Error('Invalid credentials')
//   }
  
//   const isMatch = await user.comparePassword(password)
  
//   if (!isMatch) {
//     throw new Error('Invalid credentials')
//   }
  
//   return user
// }

// export default mongoose.models.User || mongoose.model('User', UserSchema) 