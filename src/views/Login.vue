<template>
  <div class="login-container">
    <div class="login-form">
      <img src="/src/assets/images/Logo.png" alt="Logo" class="logo-image" />

      <div class="form-header">
        <h2 class="form-title">Login Form</h2>
      </div>

      <div class="form-group">
        <div class="input-container">
          <div class="icon-background">
            <font-awesome-icon icon="envelope" class="input-icon" />
          </div>
          <input
            type="text"
            id="email"
            v-model="email"
            class="form-control"
            placeholder="Email or Phone"
          />
        </div>
      </div>

      <div class="form-group">
        <div class="input-container">
          <div class="icon-background">
            <font-awesome-icon icon="lock" class="input-icon" />
          </div>
          <input
            :type="showPassword ? 'text' : 'password'"
            id="password"
            v-model="password"
            class="form-control"
            placeholder="Password"
          />
          <font-awesome-icon
            :icon="showPassword ? 'eye-slash' : 'eye'"
            class="eye-icon"
            @click="togglePasswordVisibility"
          />
        </div>
      </div>

      <button class="btn btn-primary" @click="handleLogin">Login</button>
      <p class="forgot-password">Forgot password?</p>
      <p class="signup-link">Not a member? <a href="#">Signup now</a></p>
    </div>
  </div>
</template>
    
  <script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faEnvelope,
  faLock,
  faEye,
  faEyeSlash,
} from '@fortawesome/free-solid-svg-icons'

library.add(faEnvelope, faLock, faEye, faEyeSlash)

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const router = useRouter()

const handleLogin = () => {
  if (email.value && password.value) {
    router.push({ name: 'Home' })
  } else {
    alert('Veuillez remplir tous les champs')
  }
}

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}
</script>
    
  <style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  block-size: 100vh;
}

.login-form {
  inline-size: 400px;
  padding: 25px;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  text-align: center;
}

.logo-image {
  inline-size: 100px;
  margin-block-end: 20px;
}

.form-header {
  background-color: #3fb59e;
  border-start-start-radius: 10px;
  border-start-end-radius: 10px;
  margin-block-end: 20px;
  padding: 15px;
}

.form-title {
  color: white;
  margin: 0;
  font-size: 1.5rem;
}

.form-group {
  margin-block-end: 20px;
}

.input-container {
  position: relative;
}

.icon-background {
  background-color: #3fb59e;
  padding: 10px;
  border-radius: 5px 0 0 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  inset-inline-start: 0;
  block-size: 100%;
}

.input-icon {
  color: white;
  font-size: 18px;
}

.form-control {
  inline-size: 100%;
  padding: 10px 10px 10px 45px;
  border-radius: 5px;
  border: 1px solid #ddd;
  font-size: 1rem;
  color: #333;
}

.eye-icon {
  position: absolute;
  inset-inline-end: 10px;
  inset-block-start: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  color: #6c757d;
}

.eye-icon:hover {
  color: #333;
}

.btn {
  inline-size: 100%;
  padding: 12px;
  background-color: #3fb59e;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  font-size: 1rem;
  transition: background-color 0.3s;
}

.btn:hover {
  background-color: #36a290;
}

.forgot-password,
.signup-link {
  font-size: 0.9rem;
  color: #6c757d;
  margin-block-start: 10px;
}

.signup-link {
  margin-block-start: 15px;
}

.signup-link a {
  color: #3fb59e;
  font-weight: bold;
  text-decoration: none;
}

.signup-link a:hover {
  text-decoration: underline;
}
</style>
  