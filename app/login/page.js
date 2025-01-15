
export default function Login() {
  const loginCard = {
    border: 'solid 1px #6C656544',
    height: '600px',
    width: '340px',
    borderRadius: '4px',
    boxShadow: '14px 27px 26px -30px rgba(108,101,101,1)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    margin: '4px'
  }
  const title = {
    width: '75%',
    fontSize: '32px',
    margin: 0,
    // fontFamily: '"ABeeZee", serif',
    fontWeight: 400,
    fontStyle: 'normal',
    textAlign: 'center'
  }
  const subtitle = {
    width: '75%',
    fontSize: '14px',
    // fontFamily: "ABeeZee", serif
    marginTop: '8px',
    marginBottom: '8px',
    textAlign: 'center'
  }
  const label = {
    color: '#575050',
    fontSize: '18px',
    textTransform: 'capitalize',
    alignSelf: 'start',
    marginLeft: '10%',
    marginBottom: '6px'
  }
  const textField = {
    background: '#F2EFEF',
    border: 'none',
    paddingTop: '16px',
    paddingBottom: '16px',
    color: '#242424',
    fontSize: '18px',
    textAlign: 'center',
    width: '79%',
    borderRadius: '2px',
    marginBottom: '24px'
  }
  const button = {
    backgroundColor: '#49ABDF',
    paddingTop: '15px',
    paddingBottom: '15px',
    color: '#ffffff',
    width: '80%',
    borderRadius: '2px',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    marginTop: '12px'
  }

  return (
    <div style={{display: 'flex', justifyContent: 'center', height: '100vh', alignItems: 'center'}}>
      <div style={loginCard}>
        <p style={title}>Kabut-i</p>
        <p style={subtitle}>An Intelligent Mushroom House with Environmental Control and Monitoring System for Ganoderma</p>
        <label style={label}>email</label>
        <input type="email" style={textField}/>
        <label style={label}>password</label>
        <input type="password" style={textField}/>
        <button style={button}>Login</button>
      </div>
    </div>
  );
}
