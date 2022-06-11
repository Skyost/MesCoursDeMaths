#!/bin/bash

if [[ "$VERCEL_GIT_COMMIT_REF" == "master" ]] ; then
  # Proceed with the build
  echo "✅ Ref is 'master'. The build can proceed !"
  exit 1;

else
  # Don't build
  echo "🛑 Ref is not 'master'. Cancelling build..."
  exit 0;
fi
