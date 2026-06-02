import ORMHelper from "../../libs/ORMHelper";
import { newsletterRepository } from "./newsletter.repository";




export const newsletterService = {
   saveNewsletter: async ( email: string ) => {
      
      const runner = await ORMHelper.createQueryRunner();
      try{

         const emailExists = await newsletterRepository.isEmailExist({ runner, email });
         if(emailExists){
            throw new Error("Email already exists in the newsletter list.");
         }
         const result = await newsletterRepository.save({ runner, email });
         return result;

      }catch(error){
       
         throw error;
      }
   }


}