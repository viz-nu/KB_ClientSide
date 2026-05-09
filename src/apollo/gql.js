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

export const LINE_ITEM_FRAGMENT = gql`
  fragment LineItemFields on LineItem {
    id itemCode description quantity unit ratePerUnit amount
  }
`;

export const PHOTO_FRAGMENT = gql`
  fragment PhotoFields on Photo {
    id url caption gpsLat gpsLng capturedAt
  }
`;

export const EMB_ENTRY_FRAGMENT = gql`
  fragment EmbEntryFields on EmbEntry {
    id title workCategory scheduleChapter status
    locationDescription gpsLat gpsLng
    totalAmount remarks adminRemark returnReason
    createdAt submittedAt
    engineer { ...UserFields }
    span  { _id name }
    lineItems { ...LineItemFields }
    photos    { ...PhotoFields }
    semChecklist { parameterId label value passed }
    auditLog { action user timestamp note }
  }
  ${LINE_ITEM_FRAGMENT}
  ${PHOTO_FRAGMENT}
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

export const LOGOUT = gql`
  mutation Logout { logout }
`;

export const CHANGE_PASSWORD = gql`
  mutation ChangePassword($oldPassword: String!, $newPassword: String!) {
    changePassword(oldPassword: $oldPassword, newPassword: $newPassword)
  }
`;

export const ME = gql`
  query Me {
    me {
      ...UserFields
    }
  }
  ${USER_FRAGMENT}
`;

// ─────────────────────────────────────────────
// USERS  (system_admin)
// ─────────────────────────────────────────────
export const LIST_USERS = gql`
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
`;

export const GET_USER = gql`
  query GetUser($id: ID!) {
    user(id: $id) { ...UserFields }
  }
  ${USER_FRAGMENT}
`;

export const CREATE_USER = gql`
  mutation CreateUser($userInput: UserInput!) {
    createUser(userInput: $userInput) { ...UserFields }
  }
  ${USER_FRAGMENT}
`;

export const UPDATE_USER = gql`
  mutation UpdateUser($id: ID!, $input: UpdateUserInput!) {
    updateUser(id: $id, input: $input) { ...UserFields }
  }
  ${USER_FRAGMENT}
`;

export const DELETE_USER = gql`
  mutation DeleteUser($id: ID!) { deleteUser(id: $id) }
`;

export const RESET_PASSWORD = gql`
  mutation ResetPassword($userId: ID!, $newPassword: String!) {
    resetPassword(userId: $userId, newPassword: $newPassword)
  }
`;

export const SYSTEM_HEALTH = gql`
  query SystemHealth {
    systemHealth {
      cpu memory disk activeUsers
      pendingEntries approvedEntries rejectedEntries
      recentActivity { action user timestamp }
    }
  }
`;

export const LIST_FIELD_ENGINEERS = gql`
  query ListFieldEngineers($spanId: ID!) {
    fieldEngineers(spanId: $spanId) {
      ...UserFields
    }
  }
`;

export const ASSIGN_ENGINEER = gql`
  mutation AssignEngineer($userId: ID!, $spanId: ID!) {
    assignEngineerToSpan(userId: $userId, spanId: $spanId) { id }
  }
`;

export const REMOVE_ENGINEER = gql`
  mutation RemoveEngineer($userId: ID!, $spanId: ID!) {
    removeEngineerFromSpan(userId: $userId, spanId: $spanId) { id }
  }
`;


// ─────────────────────────────────────────────
// Project Management
// ─────────────────────────────────────────────

export const CREATE_PROJECT = gql`
  mutation CreateProject($projectInput: ProjectInput!) {
    createProject(projectInput: $projectInput) { _id name }
  }
`;

export const LIST_PROJECTS = gql`
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
`;

export const SPAN_QUERIES={
  create:gql`mutation createSpan($spanInput: SpanInput!) {
    createSpan(spanInput: $spanInput) {
      project {
        _id
        name
        status
      }
      name
      startPoint {
          placeName
        pointLocation {
          type
          coordinates {
            lng
            lat
          }
        }
      }
      endPoint {
        placeName
        pointLocation {
          type
          coordinates {
            lng
            lat
          }
        }
      }
      status
      chapters {
        _id
        name
        code
        color
        items {
          _id
          label
          code
          description
          measurements
        }
      }
      Vault {
        allotedBudjet
        spentBudjet
      }
      staff {
        name
        role
        _id
      }
      createdAt
      updatedAt
    }
  }`,
  //remove:gql``,
  get:gql`query getSpans($page: Int, $limit: Int) {
    spans(page: $page, limit: $limit) {
      data {
        project {
          name
          status
        }
        name
        startPoint {
          placeName
          pointLocation {
            type
            coordinates {
              lng
              lat
            }
          }
        }
        endPoint {
          placeName
          pointLocation {
            type
            coordinates {
              lng
              lat
            }
          }
        }
        status
        chapters {
          _id
          name
          code
          color
          items {
            _id
            label
            code
            description
            measurements
          }
        }
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
      ${PAGINATION_FRAGMENT}
    `
}

export const GET_PROJECT = gql`
  query GetProject($id: ID!) {
    project(id: $id) { _id name }
  }
`;

export const UPDATE_PROJECT = gql`
  mutation UpdateProject($_id: ID!, $projectInput: ProjectInput!) {
    updateProject(_id: $_id, projectInput: $projectInput) { _id name }
  }
`;


// ─────────────────────────────────────────────
// e-MB ENTRIES
// ─────────────────────────────────────────────
export const LIST_EMB_ENTRIES = gql`
  query ListEmbEntries(
    $spanId: ID, $engineerId: ID, $status: EntryStatus,
    $workCategory: String, $from: String, $to: String,
    $page: Int, $limit: Int
  ) {
    embEntries(
      spanId: $spanId, engineerId: $engineerId, status: $status,
      workCategory: $workCategory, from: $from, to: $to,
      page: $page, limit: $limit
    ) {
      total
      items { ...EmbEntryFields }
    }
  }
  ${EMB_ENTRY_FRAGMENT}
`;

export const GET_EMB_ENTRY = gql`
  query GetEmbEntry($id: ID!) {
    embEntry(id: $id) { ...EmbEntryFields }
  }
  ${EMB_ENTRY_FRAGMENT}
`;

export const CREATE_EMB_ENTRY = gql`
  mutation CreateEmbEntry($input: CreateEmbEntryInput!) {
    createEmbEntry(input: $input) { ...EmbEntryFields }
  }
  ${EMB_ENTRY_FRAGMENT}
`;

export const UPDATE_EMB_ENTRY = gql`
  mutation UpdateEmbEntry($id: ID!, $input: UpdateEmbEntryInput!) {
    updateEmbEntry(id: $id, input: $input) { ...EmbEntryFields }
  }
  ${EMB_ENTRY_FRAGMENT}
`;

export const SUBMIT_EMB_ENTRY = gql`
  mutation SubmitEmbEntry($id: ID!) {
    submitEmbEntry(id: $id) { id status submittedAt }
  }
`;

export const DELETE_EMB_ENTRY = gql`
  mutation DeleteEmbEntry($id: ID!) { deleteEmbEntry(id: $id) }
`;

export const APPROVE_EMB_ENTRY = gql`
  mutation ApproveEmbEntry($id: ID!, $remark: String) {
    approveEmbEntry(id: $id, remark: $remark) { id status adminRemark }
  }
`;

export const REJECT_EMB_ENTRY = gql`
  mutation RejectEmbEntry($id: ID!, $remark: String!) {
    rejectEmbEntry(id: $id, remark: $remark) { id status adminRemark }
  }
`;

export const RETURN_EMB_ENTRY = gql`
  mutation ReturnEmbEntry($id: ID!, $returnReason: String!) {
    returnEmbEntry(id: $id, returnReason: $returnReason) { id status returnReason }
  }
`;

// ─────────────────────────────────────────────
// PHOTOS
// ─────────────────────────────────────────────
export const GET_PHOTO_UPLOAD_URL = gql`
  mutation GetPhotoUploadUrl($filename: String!, $contentType: String!) {
    photoUploadUrl(filename: $filename, contentType: $contentType) {
      uploadUrl
      finalUrl
    }
  }
`;

export const SAVE_PHOTO = gql`
  mutation SavePhoto($entryId: ID!, $input: PhotoUploadInput!) {
    uploadPhoto(entryId: $entryId, input: $input) { ...PhotoFields }
  }
  ${PHOTO_FRAGMENT}
`;

export const DELETE_PHOTO = gql`
  mutation DeletePhoto($photoId: ID!) { deletePhoto(photoId: $photoId) }
`;

// ─────────────────────────────────────────────
// GIS
// ─────────────────────────────────────────────
export const GIS_ENTRIES = gql`
  query GisEntries($spanId: ID!) {
    gisEntries(spanId: $spanId) {
      id title status gpsLat gpsLng workCategory totalAmount
      engineer { ...UserFields }
    }
  }
`;

// ─────────────────────────────────────────────
// REPORTS
// ─────────────────────────────────────────────
export const PROGRESS_REPORT = gql`
  query ProgressReport($spanId: ID!, $from: String!, $to: String!) {
    progressReport(spanId: $spanId, from: $from, to: $to) {
      totalEntries approved rejected pending returned totalAmount
      categoryBreakdown { category count amount }
    }
  }
`;

export const GENERATE_REPORT = gql`
  mutation GenerateReport($input: ReportInput!) {
    generateReport(input: $input) { url generatedAt }
  }
`;
