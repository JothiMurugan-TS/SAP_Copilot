import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import axios from "axios";

const getProducts = async() => {
  try {
    const response = await axios.get(`https://sapes5.sapdevcenter.com/sap/opu/odata/iwbep/GWSAMPLE_BASIC/ProductSet`, {
      auth: {
        username: 'P2008862284',
        password: 'Quadra@12345'
      },
      headers: { 'Accept': 'application/json' }
    });

    return response.data.d.results;
  } catch (error) {
    console.error('SAP Product Fetch Error:', error);
    throw error;
  }
}

/**
 * This function handles the HTTP request and returns the product information.
 *
 * @param {HttpRequest} req - The HTTP request.
 * @param {InvocationContext} context - The Azure Functions context object.
 * @returns {Promise<Response>} - A promise that resolves with the HTTP response containing the product information.
 */
export async function products(
  req: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  context.log("HTTP trigger function processed a request.");

  let response: HttpResponseInit;

  try {
    
    // Fetch products from SAP service
    const sapResponse = await getProducts();
    console.log('Mapped Products:', sapResponse);

    // Construct response
    response = {
      status: 200,
      jsonBody: {
        results: sapResponse,
      },
    };

  } catch (error) {
    context.log('Error fetching products:', error);

    // Construct error response
    response = {
      status: 500,
      jsonBody: {
        error: "An error occurred while fetching products.",
      }, 
    };
  }

  return response;
}

app.http("products", {
  methods: ["GET"],
  authLevel: "anonymous",
  handler: products,
});
