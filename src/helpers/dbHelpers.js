import AWS from "aws-sdk";

export const saveUserData = async (userId, userAddress, transaction_type) => {
  const accessKeyId = process.env.REACT_APP_AWS_ACCESS_KEY;
  const secretAccessKey = process.env.REACT_APP_AWS_SECRET_KEY;
  const region = process.env.REACT_APP_AWS_REGION;

  const credentials = new AWS.Credentials({
    accessKeyId,
    secretAccessKey,
  });

  AWS.config.update({ credentials, region });
  const dynamoDB = new AWS.DynamoDB();

  try {
    const user_item = await dynamoDB
      .getItem({
        TableName: "user-crypto-info",
        Key: {
          user_id: { N: userId },
        },
      })
      .promise();
    let updatedItem = {};

    if (user_item.Item) {
      // If the user_item exists, extract the existing values and update the user_address
      updatedItem = {
        ...user_item.Item, // Extract existing attributes
        user_address: { S: userAddress }, // Update user_address
        transaction_type: { S: transaction_type }, // Update transaction_type
      };
    } else {
      // If the user_item does not exist, create a new item with user_id and user_address
      updatedItem = {
        user_id: { N: userId },
        user_address: { S: userAddress },
      };
    }
    const params = {
      TableName: "user-crypto-info",
      Item: updatedItem,
    };

    await dynamoDB.putItem(params).promise();

    console.log("Data inserted successfully into DynamoDB");
  } catch (error) {
    console.error("Error while fetching data from DynamoDB:", error);
  }
};
