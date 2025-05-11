export const uploadContent = {
  upload: {
    title: 'Upload Your Progress',
    description: 'Share your journey by uploading your progress files, images, or data.',
    dragAndDropText: 'Drag and drop your file here, or click to select',
    supportedFormats: [
      'JSON',
      'CSV',
      'Excel',
      'Images (PNG, JPG, JPEG)'
    ],
    buttonText: 'Upload File',
    uploadingText: 'Uploading...',
    successMessage: 'File uploaded successfully!',
    errorMessages: {
      fileTooLarge: 'File size exceeds the maximum limit of 10MB',
      invalidFormat: 'Invalid file format. Please check supported formats.',
      uploadFailed: 'Failed to upload file. Please try again.',
      networkError: 'Network error. Please check your connection.'
    }
  },
  recentUploads: {
    title: 'Recent Uploads',
    noUploads: 'No recent uploads found',
    viewAll: 'View All Uploads',
    uploadDate: 'Uploaded on',
    fileType: 'File Type',
    status: 'Status',
    actions: 'Actions'
  },
  onboarding: {
    successTitle: 'You\'re on Your Way',
    successMessage: 'Your journey to sustainable transformation begins now. Please check your email to confirm your account before signing in.',
    duplicateEmail: 'This email is already in use. Please sign in or use a different email.',
    emailConfirmation: 'A confirmation email has been sent. Please check your inbox and follow the instructions to activate your account.',
    generalError: 'Submission failed. Please try again.',
    networkError: 'Network error. Please check your connection and try again.'
  },
  admin: {
    dashboardTitle: 'Client Management',
    leadsTab: 'New Leads',
    clientsTab: 'Active Clients',
    communicationTab: 'Communication',
    noLeads: 'No new leads waiting for review.',
    noClients: 'No active clients found.',
    convertButton: 'Create Client Profile',
    clientCreated: 'Lead converted to client successfully!',
    updateError: 'There was an error updating this user. Please try again.',
    unauthorizedMessage: 'You do not have permission to access this page.',
    redirectingMessage: 'Redirecting to home page...',
    leadDefinition: 'Any user with pending status - waiting for coach review',
    clientDefinition: 'Any user with active status - approved by coach'
  },
  signin: {
    title: 'Sign In',
    emailLabel: 'Email',
    passwordLabel: 'Password',
    buttonText: 'Sign In',
    forgotPassword: 'Forgot your password?',
    errorInvalid: 'Invalid email or password. Please try again.',
    errorGeneral: 'Sign in failed. Please try again.',
    welcomeBack: 'Welcome back! Redirecting...'
  },
  signout: {
    signingOut: 'Signing you out...',
    signedOut: 'You have been signed out.',
    redirecting: 'Redirecting to home...'
  },
  log: {
    unauthorized: 'You must be signed in to access your log.',
    pending: 'Your account is pending approval. Please wait for admin approval before accessing your log.',
    loading: 'Loading your log...'
  },
  theSpark: {
    title: 'Welcome Back to The Spark',
    subtitle: 'Your journey continues here. Sign in to access your log and keep building momentum.',
    instructions: 'Returning users, please sign in below to access your progress log.',
    buttonText: 'Sign In to Your Log',
    alreadySignedIn: 'You are already signed in! Redirecting to your log...'
  }
}; 