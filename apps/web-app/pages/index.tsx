import React from 'react';
import Button from '@clipl-starter/button';
import { gql, useLazyQuery, useQuery } from '@apollo/client';

const getUserDetails = gql`
  query ($name: String) {
    users(where: { name: { equals: $name } }) {
      name
      email
      posts {
        title
      }
    }
  }
`;

const getUsers = gql`
  query {
    users {
      name
    }
  }
`;

const Preamble = () => (
  <>
    <h1>Welcome to Our monorepo starter!</h1>
    <p>
      This is a simple project, with three packages, an app (this!), a graphql server, and a button
      component.
    </p>
  </>
);

function HomePage() {
  const { data: userList, loading: initialLoading, error: initialError } = useQuery(getUsers);
  const [getUser, { loading, error, data }] = useLazyQuery(getUserDetails);

  if (!userList) {
    return null;
  }

  return (
    <div
      style={{
        textAlign: 'center',
      }}
    >
      <Preamble />
      <h2>
        As a treat, we've got some cool author recs Click on an author to see some of their books:
      </h2>
      <div>
        {userList.users.map(({ name }) => (
          <Button
            key={name}
            isSelected={data && data.users[0]?.name === name}
            onClick={() => {
              getUser({ variables: { name } });
            }}
          >
            {name}
          </Button>
        ))}
      </div>
      <div style={{ marginTop: '24px' }}>
        {data ? (
          <div>
            <ul>
              {data.users[0]?.posts.map(({ title }) => (
                <li style={{ listStyle: 'none' }} key={title}>
                  {title}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default HomePage;
