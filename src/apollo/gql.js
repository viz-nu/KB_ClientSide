import { gql } from '@apollo/client';

// ─────────────────────────────────────────────
// FRAGMENTS
// ─────────────────────────────────────────────
export const USER_FRAGMENT = gql`
  fragment UserFields on User {
    _id
    name
    email
    role
    designation
    isActive
    scopes
    projects { _id name }
  }
`;
export const PAGINATION_FRAGMENT = gql`
  fragment PaginationFields on PaginationMetaData {
    page
    limit
    totalPages
    totalDocuments
  }
`;

export const ITEM_FRAGMENT = gql`
  fragment ItemFields on Item {
    _id
    label
    code
    description
    measurements 
  }
`;
export const CHAPTER_FRAGMENT = gql`
  fragment ChapterFields on Chapter {
    _id
    name
    color
    items { ...ItemFields }
  }
  ${ITEM_FRAGMENT}
`;
export const PROJECT_FRAGMENT = gql`
  fragment ProjectFields on Project {
    _id
    name 
    code 
    description 
    status 
    chapters { ...ChapterFields }
    createdAt 
    updatedAt 
    Vault { allotedBudjet spentBudjet logs  }
    cumulativeProgress
  }
  ${CHAPTER_FRAGMENT}
`;


// ─────────────────────────────────────────────
// AUTH
// ─────────────────────────────────────────────
export const MUTATIONS = {
  REFRESH_TOKEN: `
    mutation Public($refreshToken: String!) {
      newAccessToken(refreshToken: $refreshToken)
    }
  `,
};

export const LOGIN = gql`
  mutation Public($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      accessToken
      refreshToken
      user { ...UserFields }
    }
  }
  ${USER_FRAGMENT}
`;

// ─────────────────────────────────────────────
// USERS  (system_admin)
// ─────────────────────────────────────────────
export const USER_QUERIES = {
  list: gql`
  query ListUsers(
    $page: Int
    $limit: Int
    $projects: [ID]
    $isActive: Boolean
    $includeSelf: Boolean
    $role: String
  ) {
    users(
      page: $page
      limit: $limit
      projects: $projects
      isActive: $isActive
      includeSelf: $includeSelf
      role: $role
    ) {
      data {
        ...UserFields
      }
      PaginationMetaData {
        ...PaginationFields
      }
    }
  }
  ${USER_FRAGMENT}
  ${PAGINATION_FRAGMENT}
`,
  get: gql`
  query GetUser($id: ID!) {
    user(id: $id) { ...UserFields }
  }
  ${USER_FRAGMENT}
`,
  create: gql`
  mutation CreateUser($userInput: UserInput!) {
    createUser(userInput: $userInput) { ...UserFields }
  }
  ${USER_FRAGMENT}
`,
  update: gql`
  mutation UpdateUser($id: ID!, $userInput: UserInput) {
    updateUser(_id: $id, userInput: $userInput) { _id }
  }
`,
  delete: gql`
  mutation DeleteUser($id: ID!) { deleteUser(id: $id) }
`,
}


// ─────────────────────────────────────────────
// Project Management
// ─────────────────────────────────────────────

export const PROJECT_QUERIES = {
  create: gql`  mutation CreateProject($projectInput: ProjectInput!) {
    createProject(projectInput: $projectInput) { _id name }
  }`,
  update: gql`mutation UpdateProject($id: ID!, $projectInput: ProjectInput!) {
    updateProject(_id: $id, projectInput: $projectInput) { _id name }
  }`,
  list: gql`
  query ListProjects($page: Int, $limit: Int) {
    projects(page: $page, limit: $limit) {
      data { ...ProjectFields }
      PaginationMetaData {
        ...PaginationFields
      }
    }
  }
  ${PROJECT_FRAGMENT}
  ${PAGINATION_FRAGMENT}
`,
  get: gql`
  query GetProject($id: ID!) {
    project(id: $id) { ...ProjectFields }
  }
  ${PROJECT_FRAGMENT}
`,
}

// ─────────────────────────────────────────────
// Span Management
// ─────────────────────────────────────────────

export const SPAN_QUERIES = {
  create: gql`mutation createSpan($spanInput: SpanInput!) {
    createSpan(spanInput: $spanInput) {_id}
  }`,
  get: gql`query getSpan($id: ID!) {
  span(_id: $id) {
    _id
    project {
      _id
      name
      code
    }
    name
    startPoint {
      placeName
      chainNumber
      pointLocation {
        type
        coordinates
      }
    }
    endPoint {
      placeName
      chainNumber
      pointLocation {
        type
        coordinates
      }
    }
    status
    Vault {
      allotedBudjet
      spentBudjet
      logs
    }
    staff {
      _id
      designation
      name
    }
    createdAt
    updatedAt
    chapters {
      items {
        label
        description
        measurements
        _id
        code
      }
      _id
      code
      color
      name
    }
  }
}
`,
  //remove:gql``,
  list: gql`query getSpans($page: Int, $limit: Int) {
    spans(page: $page, limit: $limit) {
      data {
        _id
        project {
        _id
          name
          status
          code
        }
        name
        startPoint {
          placeName
          chainNumber
          pointLocation {
            type
            coordinates
          }
        }
        endPoint {
          placeName
          chainNumber
          pointLocation { type coordinates }
        }
        status
        chapters { ...ChapterFields }
        Vault {
          allotedBudjet
          spentBudjet
          logs
        }
        staff {
          _id
          name
        }
        createdAt
        updatedAt
      }
     PaginationMetaData {
        ...PaginationFields
      }
    }
  }
  ${CHAPTER_FRAGMENT}
      ${PAGINATION_FRAGMENT}
    `,
  update: gql` mutation UpdateSpan($id: ID!, $spanInput: SpanInput!) {
    updateSpan(_id: $id, spanInput: $spanInput){_id}
  }`,
  addStaff: gql` mutation AddStaff($id: ID!, $userId: ID!) {
    addStaff(_id: $id, userID: $userId) { _id }
  }`,
  removeStaff: gql` mutation RemoveStaff($id: ID!, $userId: ID!) {
    removeStaff(_id: $id, userID: $userId) { _id }
  }`,
}

// ─────────────────────────────────────────────
// e-MB ENTRIES
// ─────────────────────────────────────────────
export const EMB_ENTRY = {
  create: gql`mutation CreateActivity($activityInput: ActivityInput!) {
  createActivity(activityInput: $activityInput){ _id }
}
`,
  facets: gql`query activitiesFacet($status: String, $span: [ID], $project: [ID], $createdBy: [ID]) {
  activitiesFacet(status: $status, span: $span, project: $project, createdBy: $createdBy)
}`,
  list: gql`query activities($page: Int, $limit: Int, $status: String, $span: [ID], $project: [ID], $createdBy: [ID], $fromDate: DateTime, $toDate: DateTime) {
  activities(page: $page, limit: $limit, status: $status, span: $span, project: $project, createdBy: $createdBy, fromDate: $fromDate, toDate: $toDate) {
    data {
      _id
      WorkCategory
      adminRemark
      locationDescription
      returnReason
      remarks
      status
      lineItems
      span {
        _id
        name
      }
      project {
        _id
        name
      }
      createdAt
      updatedAt
      createdBy { _id name }
    }
      PaginationMetaData {
      page
      limit
      totalPages
      totalDocuments
    }
  }
}
`,
  update: gql`mutation UpdateActivityStatus($_id: ID!, $status: String!, $adminRemark: String, $returnReason: String) {
     updateActivity(
       _id: $_id,
       activityInput: {
         status: $status,
         adminRemark: $adminRemark,
         returnReason: $returnReason
       }
     ) {
       _id
       status
       adminRemark
       remarks
     }
   }
`,
}

