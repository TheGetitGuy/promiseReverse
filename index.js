const promise1 = Promise.resolve(3);
const promise2 = new Promise((resolve, reject) => { 
    setTimeout(resolve, 200, 'bar');
  });
const promise3 = new Promise((resolve, reject) => {
  //reject("Test Error")
  setTimeout(resolve, 100, 'gee');
});
const rejected = new Promise((resolve, reject) => {
  
  setTimeout(()=>reject("Test Error"), 90, 'foo');
});



Promise.myAll = (...promises) => {
  const arrToReturn = []
  let pending = promises.length
  return new Promise((resolve, reject) => {
    for (let i of promises) {
      Promise.resolve(i)
        .then((res) => {
          arrToReturn.push(res)
          if (pending === arrToReturn.length) {
            resolve(arrToReturn)
          }
        }, (rej) => {
          reject(rej)
        })
    }
  })
}



Promise.myAllSettled = (results) => {
  const returnArray = [];
  const objectBuilder = new Promise((res) => {
    results.forEach((result) => {
        Promise.resolve(result)
        .then((response) => { returnArray.push({ status: "fulfilled", response: response }) })
        .catch((rej) => { returnArray.push({ status: "rejected", reason: rej }) })
        .finally(()=>{

        if (Object.keys(returnArray).length === results.length) {
            res(returnArray)
            } 
        })
    }) 
})
  return (objectBuilder)
}

Promise.myRace = (arrayToEval)=>{
    raceFirst = new Promise((resolve)=>{
    for (let i of arrayToEval) {
        Promise.resolve(i)
          .then((res) => {
            resolve(res)
          }, (rej) => {
            resolve(rej)
          })
      }})
    return raceFirst
}

function myAll() {
  Promise.myAll(promise1, promise2, promise3).then((res) => {
    console.log(...res)
  }).catch((rej) => { console.log(rej) })
}

function myAllSettled() { 
  Promise.myAllSettled([promise1, promise2, promise3, rejected])
    .then((result) => {
      console.log(result)
    })
}

function myRace(){
    Promise.myRace([promise2, promise3, rejected])
    .then((result)=>{
        console.log(result)
    }).catch((rej) => { console.log(rej) })
}

(() => {
    myAll()
    myAllSettled()
    myRace()
})()