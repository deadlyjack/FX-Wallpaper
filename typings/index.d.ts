interface Action {
  id: String;
  action(): void;
}

interface ActionStack {
  /**
   * Pushes a action to actionStack
   * @param action Pass action id and callback function that will be called on pop
   */
  push(action: Action);
  /**
   * Pops and calls the action
   */
  pop();
  /**
   * Removes any action from actionstack
   * @param id Id of the action to remove
   */
  remove(id: String);
  /**
   * Checks whether a action exists or not
   * @param id Id of the action to check
   */
  has(id: String);
  /**
   * lenght of the actionstack
   */
  length: Number;
  /**
   * Triggered when a new action is pushed to action stack.
   * @param action 
   */
  onpush(action: Action): void;
  /**
   * Triggered when top of action stack is changed.
   * @param action 
   */
  onpop(action: Action): void;
  /**
   * Triggered when any action is removed.
   * @param action 
   */
  onremove(id: String): void;
  /**
   * Add a event listener to action stack
   * @param event 
   * @param listener 
   */
  on(event: "pop" | "push" | "remove", listener: (action: Action) => void): void;

  /**
   * Removes a event listener to action stack
   * @param event 
   * @param listener 
   */
  off(event: "pop" | "push" | "remove", listener: (action: Action) => void): void;
}

interface PageOption {
  /**
   * ID of the page. This id will will also be the elm id i.e.
   * ```html
   * <div clas="page" id="<givenID>">
   * ```
   * If not passed will be generated automatically
   */
  id: String;
  /**
   * This indicated if the page is secondary page. If value is true then page will contain hide
   * method and a back icon.
   */
  secondary: boolean;
  /**
   * Called along with the page.hide is called.
   */
  onhide(): void;
  /**
   * Tag name for body. Default is "div"
   */
  bodyTag: Array<keyof HTMLElementTagNameMap>;
}

interface Page extends HTMLElement {
  /**
   * Id of the page.
   */
  id: String;
  /**
   * Appends the page to DOM
   */
  render(): void;
  /**
   * Removes the page from DOM
   */
  hide(): void;
  /**
   * Sets content (HTML string or HTML element) of the page
   * gets conent (HTML string) of the page.
   */
  content: String;

  /**
   * Called when page is destroyed
   */
  onhide(): void;

}

interface String extends String {
  /**
   * Capitalize the string for e.g. converts "this is a string" to "This Is A String"
   */
  capitalize(): String;
  /**
   * Capitalize a character at given index for e.g.
   * ```js
   * "this is a string".capitalize(0) //"This is a string"
   * ```
   */
  capitalize(index): String;
  /**
   * Returns hashcode of the string
   */
  hashCode(): String;
  /**
   * Subtract the string passed in argument from the given string,
   * For e.g. ```"myname".subtract("my") //"name"```
   */
  subtract(str: String): String;
  /**
   * Removes all alphabets from string;
   */
  toNumber(): Number;
  /**
   * Removes all number from string;
   */
  toOnlyAlphabets(): Number;
  /**
   * Escapes regular expression special character
   */
  escapeRegexp(): String;
}

interface Ad {
  hide(): void;
  show(): void;
}

interface ImageSource{
  original: String;
  thumbnail: String;
}

interface ImageMeta{
  tags: Array<String>;
  author: String;
  website: String;
  email: String;
}

interface Image{
  id: Number;
  width: Number;
  height: Number;
  avgColor: String;
  src: ImageSource;
  localUri: String;
  meta: ImageMeta;
}

interface FileStatus {
  canRead: boolean;
  canWrite: boolean;
  exists: boolean; //indicates if file can be found on device storage
  isDirectory: boolean;
  isFile: boolean;
  isVirtual: boolean;
  lastModified: number;
  length: number;
  name: string;
  type: string;
  uri: string;
}

interface PathObject {
  dir: string;
  root: string;
  base: string;
  name: string;
  ext: string;
}

declare const app: HTMLDivElement;
declare const actionStack: ActionStack;
declare const ROOT: String;
declare const IS_ANDROID: Boolean;
declare const IS_ELECTRON: Boolean;
declare const PLATFORM: "android" | "electron" | "browser";
declare const ad: Ad;
declare const hasStoragePermission: boolean;