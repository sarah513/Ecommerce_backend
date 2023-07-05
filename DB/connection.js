import mongoose from "mongoose";
const connect=()=>{
    mongoose.connect('mongodb+srv://careskin404:WN96iwlCRDsNWgVb@cluster0.yhtvclg.mongodb.net/?retryWrites=true&w=majority').then(
        (res)=>{
            console.log('connected')
        }
    ).catch(err=>{console.log(err)})
}
export default connect