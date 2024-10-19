const BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

export class UnauthorizedError extends Error {
  constructor() {
    super("Unauthorized");
  }
}

export class NotFoundError extends Error {
  constructor() {
    super("Not Found");
  }
}

export class ServerError extends Error {
  constructor() {
    super("Server Error");
  }
}

function checkStatus(response: Response) {
  if (response.status === 401) {
    throw new UnauthorizedError();
  }
  if (response.status === 404) {
    throw new NotFoundError();
  }
  if (response.status >= 500) {
    throw new ServerError();
  }

  return response;
}

export type LoginResponse = {
  jwt: string;
};

/**
 * Authenticate the user with the given credentials
 * @param username
 * @param password
 * @returns
 */
export async function login(username: string, password: string): Promise<LoginResponse> {
  return await fetch(`${BASE_URL}/authentication/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  }).then((res) => checkStatus(res).json());
}

export type GetUserByIdResponse = {
  id: string;
  username: string;
  pictureUrl: string;
};

/**
 * Get a user by their id
 * @param token
 * @param id
 * @returns
 */
export async function getUserById(token: string, id: string): Promise<GetUserByIdResponse> {
  return await fetch(`${BASE_URL}/users/${id}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  }).then((res) => checkStatus(res).json());
}

export type GetMemesResponse = {
  total: number;
  pageSize: number;
  results: {
    id: string;
    authorId: string;
    pictureUrl: string;
    description: string;
    commentsCount: string;
    texts: {
      content: string;
      x: number;
      y: number;
    }[];
    createdAt: string;
  }[];
};

/**
 * Get the list of memes for a given page
 */
export async function getMemePage(token: string, page: number): Promise<GetMemesResponse> {
  return await fetch(`${BASE_URL}/memes?page=${page}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  }).then((res) => checkStatus(res).json());
}

export type GetMemeCommentsResponse = {
  total: number;
  pageSize: number;
  results: {
    id: string;
    authorId: string;
    memeId: string;
    content: string;
    createdAt: string;
  }[];
};

/**
 * Get comments for a meme
 */
export async function getMemeComments(
  token: string,
  memeId: string,
  page: number,
): Promise<GetMemeCommentsResponse> {
  return await fetch(`${BASE_URL}/memes/${memeId}/comments?page=${page}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  }).then((res) => checkStatus(res).json());
}

export type CreateCommentResponse = {
  id: string;
  content: string;
  createdAt: string;
  authorId: string;
  memeId: string;
};

/**
 * Create a comment for a meme
 */
export async function createMemeComment(
  token: string,
  memeId: string,
  content: string,
): Promise<CreateCommentResponse> {
  return await fetch(`${BASE_URL}/memes/${memeId}/comments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ content }),
  }).then((res) => checkStatus(res).json());
}

export type CreateMemeResponse = {
  id: string;
  authorId: string;
  createdAt: string;
  commentsCount: number;
  description: string;
  pictureUrl: string;
  texts: string[];
};

/**
 * Create a meme
 */
export async function createMeme(
  token: string,
  picture: File,
  description: string,
  texts: {
    content: string;
    x: number;
    y: number;
  }[],
): Promise<CreateMemeResponse> {
  const formData = new FormData();
  formData.append("description", description);
  formData.append("picture", picture);

  for (const [index, text] of texts.entries()) {
    formData.append(`texts[${index}][content]`, text.content);
    formData.append(`texts[${index}][X]`, Math.round(text.x).toString());
    formData.append(`texts[${index}][Y]`, Math.round(text.y).toString());
  }

  return await fetch(`${BASE_URL}/memes`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  }).then((res) => checkStatus(res).json());
}
