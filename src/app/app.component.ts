import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  genders = ['male', 'female'];
  signupForm: FormGroup;
  forbiddenUsernames = ['Chris', 'Anna']

  ngOnInit(): void {
    this.signupForm = new FormGroup({
      // FormControl 內第一個參數可以傳入預設值
      // 第二個參數可以傳入 表單驗證，單一可以直接輸入，多個可以透過陣列傳遞
      // 第三個參數可以傳入 非同步表單驗證，單一可以直接輸入，多個可以透過陣列傳遞
      'userData': new FormGroup({
        // forbiddenNames 函式內的 this 被 angular 呼叫後不會指向這個 class 所以需要 .bind(this) 重新綁定 this
        'username': new FormControl(null, [Validators.required, this.forbiddenNames.bind(this)]),
        'email': new FormControl(null, [Validators.required, Validators.email], this.forbiddenEmails.bind(this)),
      }),
      'gender': new FormControl('male'),
      'hobbies': new FormArray([])
    });
    // valueChanges 偵測所有 input 的 value 變化，會印下 value
    // this.signupForm.valueChanges.subscribe((value)=>{
    //   console.log(value)
    // })
    // valueChanges 偵測所有 input 的 status 變化，會印下 status
    this.signupForm.statusChanges.subscribe((status)=>{
      console.log(status)
    })

    // 一樣可以透過 setValue 賦值
    // this.signupForm.setValue({
    //   'userData': {
    //     'username': 'Max',
    //     'email': 'max@test.com'
    //   },
    //   'gender': 'male',
    //   'hobbies': []
    // })

    // 一樣可以透過 patchValue 覆蓋特定值
    this.signupForm.patchValue({
      'userData': {
        'username': 'Lock',
      },
    })
  }

  getControls() {
    return (<FormArray>this.signupForm.get('hobbies')).controls;
  }

  onSubmit(): void {
    console.log(this.signupForm);
    // 透過 reset() 重設，內部一樣可以傳遞資料像 setValue 一樣
    this,this.signupForm.reset();
  }

  onAddHobby(): void {
    const control = new FormControl(null, Validators.required);
    (<FormArray>this.signupForm.get('hobbies')).push(control)
  }

  // 如果不通過資料會多一個 errors 屬性紀錄 錯誤資訊
  forbiddenNames(control: FormControl): {[s: string]: boolean} {
    if (this.forbiddenUsernames.indexOf(control.value) !== -1) {
      return {
        'nameIsForbbiden': true
      }
    }
    // 如果通過驗證只能夠傳遞 null 而非 { 'nameIsForbbiden': false }
    return null;
  }

  // 客制 Validators 也可以寫成非同步
  forbiddenEmails(control: FormControl): Promise<any> | Observable<any> {
    const promise = new Promise<any>(
      (res, _rej) => {
        setTimeout(() => {
          if(control.value === 'test@test.com') {
            res({'emailIsForbidden': true})
          } else {
            res(null)
          }
        }, 1500)
      }
    );
    return promise
  }

}
