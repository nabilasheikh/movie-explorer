import React from 'react';
import { TouchableOpacity, Share, Platform, StyleSheet } from 'react-native';
import { IconSymbol } from './ui/IconSymbol';

interface ShareButtonProps {
  title: string;
  message: string;
  url?: string;
}

export const ShareButton: React.FC<ShareButtonProps> = ({ 
  title, 
  message, 
  url 
}) => {
  const onShare = async () => {
    try {
      const result = await Share.share({
        title,
        message: `${message}${url ? `\n\nCheck it out: ${url}` : ''}`,
        url: Platform.OS === 'ios' ? url : undefined
      }, {
        // iOS-specific options
        excludedActivityTypes: [
          'com.apple.UIKit.activity.PostToFacebook',
          'com.apple.UIKit.activity.PostToTwitter'
        ]
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  return (
    <TouchableOpacity 
      onPress={onShare} 
      style={styles.shareButton}
    >
      <IconSymbol 
        name="square.and.arrow.up" 
        size={24} 
        color="#000" 
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  shareButton: {
    padding: 8,
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 20,
    marginLeft: 16,
  }
});
