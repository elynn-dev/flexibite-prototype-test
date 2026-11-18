import type { ReactNode } from 'react';
import { Icon } from './Icon';
import styles from './Post.module.css';

interface PostProps {
  name: string;
  time: string;
  /** 24px round profile picture; empty shows the outlined circle. */
  avatar?: string;
  /** Colour behind a cut-out avatar (Figma avatar styles). */
  avatarBackground?: string;
  image?: string;
  imageAlt?: string;
  note?: ReactNode;
  comments?: number;
  likes?: number;
  /** Gap between the photo and the note: 12 (component default) or 24 (Join-in feed). */
  contentGap?: 12 | 24;
  className?: string;
}

/** Design-system post (Figma Components → post): who, when, photo, note, comments and likes. */
export function Post({ name, time, avatar, avatarBackground, image, imageAlt = '', note, comments, likes, contentGap = 12, className }: PostProps) {
  return (
    <article className={`${styles.post} ${className ?? ''}`}>
      <div className={styles.head}>
        <div className={styles.user}>
          <span className={styles.profile}>
            <span className={`${styles.avatar} ${avatar ? '' : styles.avatarEmpty}`} style={{ background: avatarBackground }}>
              {avatar && <img src={avatar} alt="" />}
            </span>
            <span className={styles.name}>{name}</span>
          </span>
          <span className={styles.time}>{time}</span>
        </div>
        <button type="button" className={styles.more} aria-label={`More options for ${name}'s post`}>
          <Icon name="moreMenu" size={20} />
        </button>
      </div>
      {(image || note) && (
        <div className={styles.content} style={{ gap: contentGap }}>
          {image && <img className={styles.image} src={image} alt={imageAlt} />}
          {note && <p className={styles.note}>{note}</p>}
        </div>
      )}
      <div className={styles.engagement}>
        <span className={styles.count}>
          <Icon name="commentPost" size={20} />
          {comments != null && <span>{comments}</span>}
        </span>
        <span className={styles.count}>
          <Icon name="heart" size={20} />
          {likes != null && <span>{likes}</span>}
        </span>
      </div>
    </article>
  );
}
