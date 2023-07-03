import { request, gql } from "graphql-request";
import { Web3Provider } from "@ethersproject/providers";
import snapshot from "@snapshot-labs/snapshot.js";
export const getSpace = async (spaceId) => {
  const document = gql`
    {
      space(id: "${spaceId}") {
        id
        name
        about
        network
        symbol
        members
      }
    }
  `;

  const { space } = await request("https://hub.snapshot.org/graphql", document);

  return space;
};

export const getSingleProposal = async (proposalId) => {
  const document = gql`
    { 
      proposal(id: "${proposalId}") {
        id
        title
        body
        choices
        start
        end
        snapshot
        state
        author
        space {
          id
          name
        }
      }
    }
  `;
  const { proposal } = await request(
    "https://hub.snapshot.org/graphql",
    document
  );

  return proposal;
};

export const getProposals = async (spaceId) => {
  const document = gql`
    {
      proposals(
        first: 5
        skip: 0
        where: { space_in: ["${spaceId}"] }
        orderBy: "created"
        orderDirection: desc
      ) {
        id
        title
        body
        choices
        start
        end
        snapshot
        state
        author
        space {
          id
          name
        }
      }
    }
  `;
  const { proposals } = await request(
    "https://hub.snapshot.org/graphql",
    document
  );

  return proposals;
};

export const voteProposal = async (proposalId, choice, spaceId, provider) => {
  // choice start with index 1
  const hub = "https://hub.snapshot.org"; // or https://testnet.snapshot.org for testnet
  const client = new snapshot.Client712(hub);

  const web3 = new Web3Provider(provider);
  const [account] = await web3.listAccounts();
  console.log("Account: ", account);
  const receipt = await client.vote(web3, account, {
    space: spaceId,
    proposal: proposalId,
    type: "basic",
    choice: choice,
    // reason: "Choice 1 make lot of sense",
    // app: "my-app",
  });
  console.log("Receipt: ", receipt);
  return receipt;
};
