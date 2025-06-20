import mongoose, { Schema } from 'mongoose';
var UserSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    age: { type: Number },
});
export var User = mongoose.model('User', UserSchema);
//# sourceMappingURL=user.model.js.map