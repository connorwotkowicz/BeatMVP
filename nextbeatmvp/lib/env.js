
export function getBackendUrl() {
  
  if (process.env.VERCEL_ENV === 'production') {
    return 'https://api.your-production-domain.com';
  }
  

  if (process.env.VERCEL_ENV === 'preview' && process.env.VERCEL_GIT_COMMIT_REF === 'develop') {
    return 'https://staging-api.your-domain.com';
  }
  

  if (process.env.VERCEL_ENV === 'preview') {
  
    return `https://${process.env.VERCEL_BRANCH_URL}-api.vercel.app` || 
           'https://staging-api.your-domain.com';
  }
  

  return process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';
}