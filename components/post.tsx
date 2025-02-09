"use client";

import { 
  Bookmark,
  MessageCircle, 
  Share2,
  ThumbsUp,
  Check
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { CommentDialog } from "./comment-dialog";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ShareDialog } from "./share-dialog";

interface PostProps {
  id: number | string;
  username: string;
  userImage: string;
  content: string;
  image?: string;
  video?: string;
  likes: number;
  comments: number;
  shares: number;
  isLiked: boolean;
  isBookmarked: boolean;
  categories: string[];
  isSponsored?: boolean;
  isPremium?: boolean;
  isVerified?: boolean;
  timestamp?: string;
}

interface Comment {
  id: number;
  username: string;
  content: string;
  timestamp: string;
  likes: number;
  isPremium?: boolean;
}

export function Post({
  id,
  username,
  userImage,
  content,
  image,
  video,
  likes,
  comments,
  shares,
  isLiked: initialIsLiked,
  isBookmarked: initialIsBookmarked,
  categories,
  isSponsored,
  isPremium,
  isVerified,
  timestamp = new Date().toISOString()
}: PostProps) {
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [isBookmarked, setIsBookmarked] = useState(initialIsBookmarked);
  const [showComments, setShowComments] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [localLikes, setLocalLikes] = useState(likes);
  const [localComments, setLocalComments] = useState<Comment[]>([]);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLocalLikes(prev => isLiked ? prev - 1 : prev + 1);
  };

  const handleAddComment = (comment: string) => {
    const newComment = {
      id: localComments.length + 1,
      username: "You", // You might want to get this from auth context
      content: comment,
      timestamp: new Date().toISOString(),
      likes: 0,
      isPremium: false
    };
    setLocalComments([...localComments, newComment]);
  };

  return (
    <>
      <Card className="mb-4 overflow-hidden hover:shadow-lg transition-shadow duration-200 group">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 ring-2 ring-offset-2 ring-offset-background ring-primary/10 group-hover:ring-primary/20 transition-all duration-200">
                <AvatarImage src={userImage} alt={username} />
                <AvatarFallback>{username[0]}</AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-semibold hover:text-primary transition-colors cursor-pointer">
                    {username}
                  </p>
                  {isVerified && (
                    <div className="h-4 w-4 bg-blue-500 rounded-full flex items-center justify-center">
                      <Check className="h-3 w-3 text-white" />
                    </div>
                  )}
                  {isSponsored && (
                    <Badge variant="outline" className="text-xs font-normal">
                      Sponsored
                    </Badge>
                  )}
                </div>
                <div className="flex gap-1 flex-wrap mt-1">
                  {categories.map((category) => (
                    <Badge 
                      key={`${id}-${category}`} 
                      variant="secondary" 
                      className="text-[10px] px-2 py-0 hover:bg-secondary/80 transition-colors cursor-pointer"
                    >
                      {category}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-4">
            {content && (
              <p className="text-sm text-muted-foreground leading-relaxed">
                {content}
              </p>
            )}
            {image && (
              <div className="relative rounded-lg overflow-hidden bg-muted">
                <img 
                  src={image} 
                  alt={`Post by ${username}`} 
                  className="w-full object-cover hover:scale-105 transition-transform duration-500" 
                />
              </div>
            )}
            {video && (
              <div className="relative rounded-lg overflow-hidden bg-muted">
                <video 
                  src={video} 
                  controls 
                  className="w-full hover:scale-105 transition-transform duration-500"
                />
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between mt-6 pt-4 border-t">
            <div className="flex items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLike}
                aria-label={`Like post. ${localLikes} likes`}
                className={cn(
                  "group flex items-center gap-2 transition-colors duration-200",
                  isLiked ? "text-blue-500" : "text-muted-foreground hover:text-blue-500"
                )}
              >
                <ThumbsUp className={cn(
                  "h-5 w-5 transition-all duration-200",
                  isLiked ? "scale-110" : "group-hover:scale-110"
                )} />
                <span className="text-sm font-medium">{localLikes}</span>
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowComments(true)}
                aria-label={`Comment on post. ${comments + localComments.length} comments`}
                className="group flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors duration-200"
              >
                <MessageCircle className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
                <span className="text-sm font-medium">{comments + localComments.length}</span>
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowShare(true)}
                aria-label={`Share post. ${shares} shares`}
                className="group flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors duration-200"
              >
                <Share2 className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
                <span className="text-sm font-medium">{shares}</span>
              </motion.button>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsBookmarked(!isBookmarked)}
              aria-label={isBookmarked ? "Remove bookmark" : "Bookmark post"}
              className={cn(
                "group transition-colors duration-200",
                isBookmarked ? "text-primary" : "text-muted-foreground hover:text-primary"
              )}
            >
              <Bookmark className={cn(
                "h-5 w-5 transition-all duration-200",
                isBookmarked ? "scale-110 fill-current" : "group-hover:scale-110"
              )} />
            </motion.button>
          </div>
        </div>
      </Card>

      {/* Comment Dialog */}
      <CommentDialog
        variant="sidebar"
        isOpen={showComments}
        onClose={() => setShowComments(false)}
        post={{
          id: typeof id === 'string' ? parseInt(id) : id,
          username,
          avatar: userImage,
          verified: isVerified || false,
          isPremium: isPremium || false,
          image: image || video || '',
          caption: content,
          timestamp: timestamp,
          likes: localLikes,
          views: `${Math.floor(localLikes * 2)}`,
          comments: localComments
        }}
        onAddComment={handleAddComment}
      />

      {/* Share Dialog */}
      <ShareDialog 
        isOpen={showShare}
        onClose={() => setShowShare(false)}
        post={{
          id: typeof id === 'string' ? parseInt(id) : id,
          username,
          caption: content
        }}
      />
    </>
  );
}
