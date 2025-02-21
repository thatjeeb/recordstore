export const isHostedOnThatjeebGithub = (): boolean => {
  return window.location.href.toLowerCase().includes("thatjeeb.github.io/recordstore");
};

export const isLocalHost = (): boolean => {
  return window.location.href.toLowerCase().includes("127.0.0.1") || window.location.href.toLowerCase().includes("localhost");
};
