export const fakeDocumentCookie = {
  cookies: '',

  get cookie() {
    return this.cookies;
  },

  set cookie(cookieValue) {
    const cookies = this.cookies.split(' ');
    const cookieName = cookieValue.split('=').shift();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const cookieNameLength = cookieName.length;
    let cookieIndex = -1;
    cookies.forEach((value, index) => {
      if (`${value.substr(0, cookieNameLength)}=` === `${cookieName}=`) {
        cookieIndex = index;
      }
    });
    if (cookieIndex > -1) {
      cookies[cookieIndex] = `${cookieValue};`;
    } else {
      cookies.push(`${cookieValue};`);
    }
    this.cookies = cookies.join(' ').trim();
  },
};

const setCookie = (name: string, value: string, domain:string,days = 1) => {
  let expires = ''
  if (days) {
    const date = new Date()
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000)
    expires = '; expires=' + date.toUTCString()
  }
  if(process.env.NODE_ENV === 'test') {
    fakeDocumentCookie.cookie = name + '=' + (value || '') + expires + `; path=/; domain=${domain}`
  } else {
    document.cookie = name + '=' + (value || '') + expires + `; path=/; domain=${domain}`
  }
}

const getCookie = (name: string) => {
  const nameEQ = name + '='
  let ca = []
  if(process.env.NODE_ENV === 'test') {
    ca = fakeDocumentCookie.cookie.split(';')
  } else {
    ca = document.cookie.split(';')
  }
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i]
    while (c.charAt(0) === ' ') c = c.substring(1, c.length)
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length)
  }
  return null
}

export interface StorageInterface {
  getItem: () => string | null
  setItem: (value: string, days?:number) => void
  removeItem: () => void
  overrideMainDomain: (domain:string) => void
}
export interface StorageConfigInterface {
  domain?:string
  storageKey?:string
}

/*
  * A storage class that uses cookies to store data
  * @param {string} domain - The domain to store the cookie on
  * @method getItem - Gets the value of a cookie
  * @method setItem - Sets the value of a cookie
  * @method removeItem - Removes a cookie
  * @method overrideMainDomain - Overrides the domain of the cookie
 */
class CookiesStorage implements StorageInterface {
  private static instance: CookiesStorage

  private domain: string
  private readonly storageKey: string

  constructor(config?:StorageConfigInterface) {
    this.domain = config?.domain || process.env.NODE_ENV === 'test' ? 'dummy.com' : window.location.host
    this.storageKey = config?.storageKey || `auth-tokens-${process.env.NODE_ENV}`
  }

  getItem() {
    return getCookie(this.storageKey)
  }
  setItem(value: string, days = 1) {
    setCookie(this.storageKey, value, this.domain, days)
  }
  removeItem() {
    setCookie(this.storageKey, '', this.domain)
  }
  overrideMainDomain(domain: string) {
    this.domain = domain
    setCookie(this.storageKey, this.getItem() || '', domain)
  }
}

export default CookiesStorage
