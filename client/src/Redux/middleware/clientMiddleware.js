/**
 * @author Candice
 * @date 2018/6/7 15:22
 */

export const errData = {
    errorNum: -1,
    message: '服务器繁忙,请稍后重试!',
  };
  
  /**
   * 该中间件使得支持一种特定的action类型
   * action eg.
   *  {
          types: [REQUEST, SUCCESS, FAIL],
          promise: fetchPromise(url)
      };
   * @param store
   */
  const clientMiddleware = store => next => action => {
    if (typeof action === 'function') {
      return action(store.dispatch, store.getState);
    }
    const { promise, types, ...rest } = action;
    if (!promise) {
      return next(action);
    }
    const [REQUEST, SUCCESS, FAILURE] = types;
    next({ ...rest, type: REQUEST });
  
    // 返回Promise
    return new Promise(resolve => {
      promise
        .then(json => {
          if (json.errorNum === 0) {
            
            next({ ...rest, result: json, type: SUCCESS });
          } else {
            next({ ...rest, error: json, type: FAILURE });
          }
          resolve(json);
        })
        .catch(err => {
          console.log('错误',err)
          next({ ...rest, error: errData, type: FAILURE });
          resolve();
        });
    });
  };
  export default clientMiddleware;
  