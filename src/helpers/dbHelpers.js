import AWS from "aws-sdk";

export const saveUserData = async (
  userId,
  userAddress,
  uuid4,
  transaction_type,
  full_url,
  created_at
) => {
  const accessKeyId = process.env.REACT_APP_AWS_ACCESS_KEY;
  const secretAccessKey = process.env.REACT_APP_AWS_SECRET_KEY;
  const region = process.env.REACT_APP_AWS_REGION;

  const credentials = new AWS.Credentials({
    accessKeyId,
    secretAccessKey,
  });

  AWS.config.update({ credentials, region });
  const dynamoDB = new AWS.DynamoDB();

  const params = {
    TableName: "user-crypto-info",
    Item: {
      user_id: { N: userId },
      wallet_address: { S: userAddress },
      transaction_info: {
        M: {
          uuid4: { S: uuid4 },
          transaction_type: { S: transaction_type },
          full_url: { S: full_url },
          created_at: { S: created_at },
        },
      },
    },
  };

  try {
    await dynamoDB.putItem(params).promise();
    console.log("Data inserted successfully into DynamoDB");
  } catch (error) {
    console.error("Error while inserting data into DynamoDB:", error);
  }
};
