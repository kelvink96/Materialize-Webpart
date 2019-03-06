export default class MyForm {
  public static formHtml: string = `
  <div class="container">
<div class="row">
<div class="row">
<div class="input-field col s6">
<i class="fas fa-user prefix"></i>
  <input id="icon_prefix" type="text" class="validate f-name">
  <label for="icon_prefix">First Name</label>
</div>
<div class="input-field col s6">
<i class="fas fa-mobile prefix"></i>
  <input id="icon_telephone" type="tel" class="validate user-mobile">
  <label for="icon_telephone">Mobile No.</label>
</div>
</div>
<div class="row">
<button class="btn waves-effect waves-light click" type="button">Submit
  </button>
  </div>
  </div>
  </div>
  `;
}
