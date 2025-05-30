import axios from "axios";
import DjangoConfig from "../config/config";


const getItemById = async (id) => {
    try {
        const response = await axios.get(`${DjangoConfig.apiUrl}/main/product/${id}`,
            {headers: {
                "Content-Type": "application/json",
              },
            }
        )
        return response.data;  // Return the fetched product item
        
        
    } catch (error) {
        console.error(error);
    }
};
export default getItemById