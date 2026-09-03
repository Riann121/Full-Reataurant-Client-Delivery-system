export type TokenServiceResponse =
    | { stat: "success"; token: string }
    | { stat: "fail"; msg: string };
