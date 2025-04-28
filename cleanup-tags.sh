#!/bin/bash

# Get all tags
TAGS=$(git tag -l)

# Keep track of which tags to keep
KEEP_TAGS=()

# Loop through each tag
for TAG in $TAGS; do
    # Check if the tag matches the pattern v0.0.X
    if [[ $TAG =~ ^v0\.0\.[0-9]+$ ]]; then
        # This is a valid tag, keep it
        KEEP_TAGS+=("$TAG")
    else
        # This is an unexpected tag, delete it
        echo "Deleting unexpected tag: $TAG"
        git tag -d "$TAG"
    fi
done

# Show which tags were kept
echo ""
echo "Kept tags:"
for TAG in "${KEEP_TAGS[@]}"; do
    echo "  $TAG"
done

echo ""
echo "Tag cleanup complete!"
echo "Run './push-tags.sh' to update the remote repository."
