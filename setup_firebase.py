#!/usr/bin/env python3
"""
Firebase Setup Helper for Traceveil

This script helps you set up Firebase for the Traceveil application.
Supports both environment variables and JSON file methods.
"""

import os
import json
import shutil

def setup_firebase_env():
    """Set up Firebase using environment variables"""
    print("🔧 Setting up Firebase via Environment Variables")
    print("=" * 50)

    # Check if .env file exists
    env_file = '.env'
    if os.path.exists(env_file):
        print(f"⚠️  .env file already exists at {env_file}")
        overwrite = input("Overwrite existing .env file? (y/n): ").lower()
        if overwrite != 'y':
            print("Keeping existing .env file")
            return

    # Copy from template
    template_file = '.env.example'
    if os.path.exists(template_file):
        shutil.copy2(template_file, env_file)
        print(f"✅ Created .env file from template")
        print("\n📝 Next steps:")
        print("1. Edit .env file with your Firebase service account credentials")
        print("2. Get credentials from: Firebase Console > Project Settings > Service Accounts")
        print("3. Set USE_MOCK_FIREBASE=false in .env")
        print("4. Restart your application")
    else:
        print("❌ .env.example template not found")

def setup_firebase_file():
    """Set up Firebase using JSON file (traditional method)"""
    print("🔧 Setting up Firebase via JSON File")
    print("=" * 50)

    print("\n📋 Current Firebase Configuration:")
    print("- Project ID: traceveil-core")
    print("- Status: Mock mode (development)")

    print("\n🔑 To get service account credentials:")
    print("1. Go to https://console.firebase.google.com/")
    print("2. Select project 'traceveil-core'")
    print("3. Go to Project Settings > Service Accounts")
    print("4. Click 'Generate new private key'")
    print("5. Download the JSON file")
    print("6. Save it as 'firebase-credentials.json' in the project root")

    choice = input("\n❓ Do you have the service account JSON file ready? (y/n): ").lower()

    if choice == 'y':
        cred_file = input("📁 Enter the path to your service account JSON file: ").strip()

        if os.path.exists(cred_file):
            try:
                # Validate the JSON
                with open(cred_file, 'r') as f:
                    data = json.load(f)

                required_fields = ['type', 'project_id', 'private_key', 'client_email']
                if all(field in data for field in required_fields):
                    # Copy to project root
                    shutil.copy2(cred_file, 'firebase-credentials.json')
                    print("✅ Firebase credentials installed successfully!")

                    # Update environment or provide instructions
                    print("\n🔧 To enable Firebase:")
                    print("   Option 1: Set environment variable: set USE_MOCK_FIREBASE=false")
                    print("   Option 2: Edit .env file: USE_MOCK_FIREBASE=false")
                    print("   Then restart your application")

                else:
                    print("❌ Invalid service account JSON file (missing required fields)")

            except json.JSONDecodeError:
                print("❌ Invalid JSON file")
            except Exception as e:
                print(f"❌ Error: {e}")
        else:
            print("❌ File not found")

    else:
        print("\n📚 For now, the application will continue using mock Firebase.")
        print("   This is perfect for development and testing!")
        print("\n💡 When you're ready to enable Firebase:")
        print("   1. Get service account credentials from Firebase Console")
        print("   2. Run this script again")
        print("   3. Set USE_MOCK_FIREBASE=false")

def main():
    print("🔥 Firebase Setup Helper for Traceveil")
    print("=" * 50)

    print("\n📋 Available setup methods:")
    print("1. Environment Variables (Recommended for production)")
    print("2. JSON File (Traditional method)")
    print("3. Skip setup (Continue with mock mode)")

    choice = input("\n❓ Choose setup method (1/2/3): ").strip()

    if choice == '1':
        setup_firebase_env()
    elif choice == '2':
        setup_firebase_file()
    elif choice == '3':
        print("\n📚 Continuing with mock Firebase mode")
        print("   This is perfect for development and testing!")
        print("\n💡 To enable Firebase later:")
        print("   Run: python setup_firebase.py")
    else:
        print("❌ Invalid choice")

if __name__ == "__main__":
    main()