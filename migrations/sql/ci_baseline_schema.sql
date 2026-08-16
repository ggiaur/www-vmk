--
-- PostgreSQL database dump
--

-- Dumped from database version 16.14
-- Dumped by pg_dump version 16.14

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: enum__events_v_version_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum__events_v_version_status AS ENUM (
    'draft',
    'published'
);


--
-- Name: enum__events_v_version_target_audience; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum__events_v_version_target_audience AS ENUM (
    'all',
    'children',
    'teens',
    'adults',
    'seniors'
);


--
-- Name: enum__news_v_version_category; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum__news_v_version_category AS ENUM (
    'general',
    'announcement',
    'grant',
    'archive'
);


--
-- Name: enum__news_v_version_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum__news_v_version_status AS ENUM (
    'draft',
    'published'
);


--
-- Name: enum__pages_v_version_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum__pages_v_version_status AS ENUM (
    'draft',
    'published'
);


--
-- Name: enum_bookings_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_bookings_status AS ENUM (
    'pending',
    'confirmed',
    'rejected'
);


--
-- Name: enum_contact_messages_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_contact_messages_status AS ENUM (
    'new',
    'in-progress',
    'answered'
);


--
-- Name: enum_contact_messages_subject; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_contact_messages_subject AS ENUM (
    'general',
    'lending',
    'event',
    'room',
    'local-history'
);


--
-- Name: enum_documents_category; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_documents_category AS ENUM (
    'szmsz',
    'report',
    'grant',
    'form',
    'other'
);


--
-- Name: enum_donation_pledges_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_donation_pledges_status AS ENUM (
    'new',
    'contacted',
    'completed'
);


--
-- Name: enum_events_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_events_status AS ENUM (
    'draft',
    'published'
);


--
-- Name: enum_events_target_audience; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_events_target_audience AS ENUM (
    'all',
    'children',
    'teens',
    'adults',
    'seniors'
);


--
-- Name: enum_libraries_type; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_libraries_type AS ENUM (
    'central',
    'branch',
    'department'
);


--
-- Name: enum_news_category; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_news_category AS ENUM (
    'general',
    'announcement',
    'grant',
    'archive'
);


--
-- Name: enum_news_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_news_status AS ENUM (
    'draft',
    'published'
);


--
-- Name: enum_opening_hours_day_of_week; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_opening_hours_day_of_week AS ENUM (
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
    'sunday'
);


--
-- Name: enum_pages_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_pages_status AS ENUM (
    'draft',
    'published'
);


--
-- Name: enum_partners_type; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_partners_type AS ENUM (
    'supporter',
    'partner'
);


--
-- Name: enum_payload_folders_folder_type; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_payload_folders_folder_type AS ENUM (
    'media',
    'galleries'
);


--
-- Name: enum_products_category; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_products_category AS ENUM (
    'used_book',
    'gift',
    'other'
);


--
-- Name: enum_products_stock_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_products_stock_status AS ENUM (
    'available',
    'soldout'
);


--
-- Name: enum_registrations_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_registrations_status AS ENUM (
    'confirmed',
    'cancelled'
);


--
-- Name: enum_users_role; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_users_role AS ENUM (
    'admin',
    'editor',
    'author'
);


--
-- Name: enum_wish_comments_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_wish_comments_status AS ENUM (
    'pending',
    'approved',
    'rejected'
);


--
-- Name: enum_wish_requests_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_wish_requests_status AS ENUM (
    'pending',
    'approved',
    'fulfilled',
    'rejected'
);


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: _events_v; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public._events_v (
    id integer NOT NULL,
    parent_id integer,
    version_title character varying,
    version_slug character varying,
    version_start_date timestamp(3) with time zone,
    version_end_date timestamp(3) with time zone,
    version_location_id integer,
    version_target_audience public.enum__events_v_version_target_audience DEFAULT 'all'::public.enum__events_v_version_target_audience,
    version_description jsonb,
    version_registration_url character varying,
    version_capacity numeric,
    version_featured_image_id integer,
    version_updated_at timestamp(3) with time zone,
    version_created_at timestamp(3) with time zone,
    version__status public.enum__events_v_version_status DEFAULT 'draft'::public.enum__events_v_version_status,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    latest boolean
);


--
-- Name: _events_v_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public._events_v_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: _events_v_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public._events_v_id_seq OWNED BY public._events_v.id;


--
-- Name: _news_v; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public._news_v (
    id integer NOT NULL,
    parent_id integer,
    version_title character varying,
    version_slug character varying,
    version_published_at timestamp(3) with time zone,
    version_category public.enum__news_v_version_category DEFAULT 'general'::public.enum__news_v_version_category,
    version_summary character varying,
    version_content jsonb,
    version_featured_image_id integer,
    version_related_library_id integer,
    version_author_id integer,
    version_source_note character varying,
    version_updated_at timestamp(3) with time zone,
    version_created_at timestamp(3) with time zone,
    version__status public.enum__news_v_version_status DEFAULT 'draft'::public.enum__news_v_version_status,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    latest boolean
);


--
-- Name: _news_v_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public._news_v_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: _news_v_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public._news_v_id_seq OWNED BY public._news_v.id;


--
-- Name: _pages_v; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public._pages_v (
    id integer NOT NULL,
    parent_id integer,
    version_title character varying,
    version_slug character varying,
    version_meta_description character varying,
    version_updated_at timestamp(3) with time zone,
    version_created_at timestamp(3) with time zone,
    version__status public.enum__pages_v_version_status DEFAULT 'draft'::public.enum__pages_v_version_status,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    latest boolean
);


--
-- Name: _pages_v_blocks_accordion; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public._pages_v_blocks_accordion (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    _path text NOT NULL,
    id integer NOT NULL,
    title character varying,
    _uuid character varying,
    block_name character varying
);


--
-- Name: _pages_v_blocks_accordion_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public._pages_v_blocks_accordion_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: _pages_v_blocks_accordion_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public._pages_v_blocks_accordion_id_seq OWNED BY public._pages_v_blocks_accordion.id;


--
-- Name: _pages_v_blocks_accordion_items; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public._pages_v_blocks_accordion_items (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id integer NOT NULL,
    question character varying,
    answer jsonb,
    _uuid character varying
);


--
-- Name: _pages_v_blocks_accordion_items_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public._pages_v_blocks_accordion_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: _pages_v_blocks_accordion_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public._pages_v_blocks_accordion_items_id_seq OWNED BY public._pages_v_blocks_accordion_items.id;


--
-- Name: _pages_v_blocks_contact_info; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public._pages_v_blocks_contact_info (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    _path text NOT NULL,
    id integer NOT NULL,
    title character varying,
    address character varying,
    phone character varying,
    email character varying,
    map_embed_url character varying,
    _uuid character varying,
    block_name character varying
);


--
-- Name: _pages_v_blocks_contact_info_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public._pages_v_blocks_contact_info_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: _pages_v_blocks_contact_info_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public._pages_v_blocks_contact_info_id_seq OWNED BY public._pages_v_blocks_contact_info.id;


--
-- Name: _pages_v_blocks_downloads; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public._pages_v_blocks_downloads (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    _path text NOT NULL,
    id integer NOT NULL,
    title character varying,
    _uuid character varying,
    block_name character varying
);


--
-- Name: _pages_v_blocks_downloads_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public._pages_v_blocks_downloads_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: _pages_v_blocks_downloads_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public._pages_v_blocks_downloads_id_seq OWNED BY public._pages_v_blocks_downloads.id;


--
-- Name: _pages_v_blocks_hero; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public._pages_v_blocks_hero (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    _path text NOT NULL,
    id integer NOT NULL,
    heading character varying,
    subheading character varying,
    image_id integer,
    cta_label character varying,
    cta_href character varying,
    _uuid character varying,
    block_name character varying
);


--
-- Name: _pages_v_blocks_hero_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public._pages_v_blocks_hero_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: _pages_v_blocks_hero_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public._pages_v_blocks_hero_id_seq OWNED BY public._pages_v_blocks_hero.id;


--
-- Name: _pages_v_blocks_partners_grid; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public._pages_v_blocks_partners_grid (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    _path text NOT NULL,
    id integer NOT NULL,
    title character varying,
    _uuid character varying,
    block_name character varying
);


--
-- Name: _pages_v_blocks_partners_grid_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public._pages_v_blocks_partners_grid_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: _pages_v_blocks_partners_grid_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public._pages_v_blocks_partners_grid_id_seq OWNED BY public._pages_v_blocks_partners_grid.id;


--
-- Name: _pages_v_blocks_rich_text; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public._pages_v_blocks_rich_text (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    _path text NOT NULL,
    id integer NOT NULL,
    content jsonb,
    _uuid character varying,
    block_name character varying
);


--
-- Name: _pages_v_blocks_rich_text_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public._pages_v_blocks_rich_text_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: _pages_v_blocks_rich_text_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public._pages_v_blocks_rich_text_id_seq OWNED BY public._pages_v_blocks_rich_text.id;


--
-- Name: _pages_v_blocks_video_embed; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public._pages_v_blocks_video_embed (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    _path text NOT NULL,
    id integer NOT NULL,
    title character varying,
    embed_url character varying,
    _uuid character varying,
    block_name character varying
);


--
-- Name: _pages_v_blocks_video_embed_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public._pages_v_blocks_video_embed_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: _pages_v_blocks_video_embed_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public._pages_v_blocks_video_embed_id_seq OWNED BY public._pages_v_blocks_video_embed.id;


--
-- Name: _pages_v_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public._pages_v_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: _pages_v_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public._pages_v_id_seq OWNED BY public._pages_v.id;


--
-- Name: _pages_v_rels; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public._pages_v_rels (
    id integer NOT NULL,
    "order" integer,
    parent_id integer NOT NULL,
    path character varying NOT NULL,
    documents_id integer,
    partners_id integer
);


--
-- Name: _pages_v_rels_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public._pages_v_rels_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: _pages_v_rels_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public._pages_v_rels_id_seq OWNED BY public._pages_v_rels.id;


--
-- Name: bookings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.bookings (
    id integer NOT NULL,
    room_id integer NOT NULL,
    date timestamp(3) with time zone NOT NULL,
    start_time character varying NOT NULL,
    end_time character varying NOT NULL,
    requester_name character varying NOT NULL,
    requester_email character varying NOT NULL,
    purpose character varying,
    status public.enum_bookings_status DEFAULT 'pending'::public.enum_bookings_status NOT NULL,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL
);


--
-- Name: bookings_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.bookings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: bookings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.bookings_id_seq OWNED BY public.bookings.id;


--
-- Name: contact_messages; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.contact_messages (
    id integer NOT NULL,
    name character varying NOT NULL,
    email character varying NOT NULL,
    subject public.enum_contact_messages_subject DEFAULT 'general'::public.enum_contact_messages_subject NOT NULL,
    message character varying NOT NULL,
    status public.enum_contact_messages_status DEFAULT 'new'::public.enum_contact_messages_status NOT NULL,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL
);


--
-- Name: contact_messages_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.contact_messages_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: contact_messages_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.contact_messages_id_seq OWNED BY public.contact_messages.id;


--
-- Name: documents; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.documents (
    id integer NOT NULL,
    title character varying NOT NULL,
    file_id integer NOT NULL,
    category public.enum_documents_category DEFAULT 'other'::public.enum_documents_category NOT NULL,
    year numeric,
    download_count numeric DEFAULT 0,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    source_url character varying
);


--
-- Name: documents_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.documents_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: documents_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.documents_id_seq OWNED BY public.documents.id;


--
-- Name: donation_pledges; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.donation_pledges (
    id integer NOT NULL,
    name character varying NOT NULL,
    email character varying NOT NULL,
    amount numeric,
    message character varying,
    status public.enum_donation_pledges_status DEFAULT 'new'::public.enum_donation_pledges_status NOT NULL,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL
);


--
-- Name: donation_pledges_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.donation_pledges_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: donation_pledges_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.donation_pledges_id_seq OWNED BY public.donation_pledges.id;


--
-- Name: events; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.events (
    id integer NOT NULL,
    title character varying,
    slug character varying,
    start_date timestamp(3) with time zone,
    end_date timestamp(3) with time zone,
    location_id integer,
    target_audience public.enum_events_target_audience DEFAULT 'all'::public.enum_events_target_audience,
    description jsonb,
    registration_url character varying,
    capacity numeric,
    featured_image_id integer,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    _status public.enum_events_status DEFAULT 'draft'::public.enum_events_status
);


--
-- Name: events_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.events_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: events_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.events_id_seq OWNED BY public.events.id;


--
-- Name: footer_settings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.footer_settings (
    id integer NOT NULL,
    institution_name character varying DEFAULT 'Vörösmarty Mihály Könyvtár'::character varying,
    address character varying DEFAULT '8000 Székesfehérvár, Kossuth u. 3.'::character varying,
    phone character varying DEFAULT '+36 22 313-971'::character varying,
    email character varying DEFAULT 'vmk@vmk.hu'::character varying,
    opening_hours_summary character varying DEFAULT 'H–P: 10:00–18:00
Szo: 10:00–14:00
V: Zárva'::character varying,
    facebook_url character varying,
    instagram_url character varying,
    youtube_url character varying,
    copyright_text character varying DEFAULT '© Vörösmarty Mihály Könyvtár'::character varying,
    privacy_url character varying DEFAULT '/adatvedelmi-tajekoztato'::character varying,
    accessibility_statement_url character varying DEFAULT '/akadalymentesites'::character varying,
    updated_at timestamp(3) with time zone,
    created_at timestamp(3) with time zone
);


--
-- Name: footer_settings_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.footer_settings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: footer_settings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.footer_settings_id_seq OWNED BY public.footer_settings.id;


--
-- Name: footer_settings_quick_links; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.footer_settings_quick_links (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id character varying NOT NULL,
    label character varying NOT NULL,
    url character varying NOT NULL
);


--
-- Name: galleries; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.galleries (
    id integer NOT NULL,
    title character varying NOT NULL,
    slug character varying NOT NULL,
    event_date timestamp(3) with time zone,
    related_event_id integer,
    cover_image_id integer,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    folder_id integer
);


--
-- Name: galleries_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.galleries_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: galleries_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.galleries_id_seq OWNED BY public.galleries.id;


--
-- Name: galleries_rels; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.galleries_rels (
    id integer NOT NULL,
    "order" integer,
    parent_id integer NOT NULL,
    path character varying NOT NULL,
    media_id integer
);


--
-- Name: galleries_rels_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.galleries_rels_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: galleries_rels_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.galleries_rels_id_seq OWNED BY public.galleries_rels.id;


--
-- Name: header_settings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.header_settings (
    id integer NOT NULL,
    top_bar_phone character varying DEFAULT '+36 22 313-971'::character varying,
    top_bar_email character varying DEFAULT 'vmk@vmk.hu'::character varying,
    catalog_url character varying DEFAULT 'https://vmk.ik.hu'::character varying,
    updated_at timestamp(3) with time zone,
    created_at timestamp(3) with time zone
);


--
-- Name: header_settings_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.header_settings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: header_settings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.header_settings_id_seq OWNED BY public.header_settings.id;


--
-- Name: header_settings_nav_items; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.header_settings_nav_items (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id character varying NOT NULL,
    label character varying NOT NULL,
    url character varying NOT NULL,
    open_in_new_tab boolean DEFAULT false
);


--
-- Name: libraries; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.libraries (
    id integer NOT NULL,
    name character varying NOT NULL,
    slug character varying NOT NULL,
    type public.enum_libraries_type NOT NULL,
    address character varying NOT NULL,
    phone character varying,
    email character varying,
    geolocation_latitude numeric,
    geolocation_longitude numeric,
    featured_image_id integer,
    description jsonb,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    color character varying
);


--
-- Name: libraries_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.libraries_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: libraries_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.libraries_id_seq OWNED BY public.libraries.id;


--
-- Name: media; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.media (
    id integer NOT NULL,
    alt character varying NOT NULL,
    caption character varying,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    url character varying,
    thumbnail_u_r_l character varying,
    filename character varying,
    mime_type character varying,
    filesize numeric,
    width numeric,
    height numeric,
    focal_x numeric,
    focal_y numeric,
    sizes_thumbnail_url character varying,
    sizes_thumbnail_width numeric,
    sizes_thumbnail_height numeric,
    sizes_thumbnail_mime_type character varying,
    sizes_thumbnail_filesize numeric,
    sizes_thumbnail_filename character varying,
    sizes_card_url character varying,
    sizes_card_width numeric,
    sizes_card_height numeric,
    sizes_card_mime_type character varying,
    sizes_card_filesize numeric,
    sizes_card_filename character varying,
    sizes_hero_url character varying,
    sizes_hero_width numeric,
    sizes_hero_height numeric,
    sizes_hero_mime_type character varying,
    sizes_hero_filesize numeric,
    sizes_hero_filename character varying,
    folder_id integer
);


--
-- Name: media_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.media_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: media_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.media_id_seq OWNED BY public.media.id;


--
-- Name: news; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.news (
    id integer NOT NULL,
    title character varying,
    slug character varying,
    published_at timestamp(3) with time zone,
    category public.enum_news_category DEFAULT 'general'::public.enum_news_category,
    summary character varying,
    content jsonb,
    featured_image_id integer,
    related_library_id integer,
    author_id integer,
    source_note character varying,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    _status public.enum_news_status DEFAULT 'draft'::public.enum_news_status
);


--
-- Name: news_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.news_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: news_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.news_id_seq OWNED BY public.news.id;


--
-- Name: newsletter_subscribers; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.newsletter_subscribers (
    id integer NOT NULL,
    email character varying NOT NULL,
    name character varying,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL
);


--
-- Name: newsletter_subscribers_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.newsletter_subscribers_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: newsletter_subscribers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.newsletter_subscribers_id_seq OWNED BY public.newsletter_subscribers.id;


--
-- Name: opening_hours; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.opening_hours (
    id integer NOT NULL,
    library_id integer NOT NULL,
    day_of_week public.enum_opening_hours_day_of_week NOT NULL,
    open_time character varying,
    close_time character varying,
    is_closed boolean DEFAULT false,
    special_note character varying,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL
);


--
-- Name: opening_hours_global; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.opening_hours_global (
    id integer NOT NULL,
    banner_message character varying,
    updated_at timestamp(3) with time zone,
    created_at timestamp(3) with time zone
);


--
-- Name: opening_hours_global_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.opening_hours_global_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: opening_hours_global_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.opening_hours_global_id_seq OWNED BY public.opening_hours_global.id;


--
-- Name: opening_hours_global_special_periods; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.opening_hours_global_special_periods (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id character varying NOT NULL,
    date timestamp(3) with time zone NOT NULL,
    label character varying NOT NULL,
    is_closed boolean DEFAULT true,
    open_time character varying,
    close_time character varying,
    affected_library_id integer
);


--
-- Name: opening_hours_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.opening_hours_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: opening_hours_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.opening_hours_id_seq OWNED BY public.opening_hours.id;


--
-- Name: pages; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.pages (
    id integer NOT NULL,
    title character varying,
    slug character varying,
    meta_description character varying,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    _status public.enum_pages_status DEFAULT 'draft'::public.enum_pages_status
);


--
-- Name: pages_blocks_accordion; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.pages_blocks_accordion (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    _path text NOT NULL,
    id character varying NOT NULL,
    title character varying,
    block_name character varying
);


--
-- Name: pages_blocks_accordion_items; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.pages_blocks_accordion_items (
    _order integer NOT NULL,
    _parent_id character varying NOT NULL,
    id character varying NOT NULL,
    question character varying,
    answer jsonb
);


--
-- Name: pages_blocks_contact_info; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.pages_blocks_contact_info (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    _path text NOT NULL,
    id character varying NOT NULL,
    title character varying,
    address character varying,
    phone character varying,
    email character varying,
    map_embed_url character varying,
    block_name character varying
);


--
-- Name: pages_blocks_downloads; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.pages_blocks_downloads (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    _path text NOT NULL,
    id character varying NOT NULL,
    title character varying,
    block_name character varying
);


--
-- Name: pages_blocks_hero; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.pages_blocks_hero (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    _path text NOT NULL,
    id character varying NOT NULL,
    heading character varying,
    subheading character varying,
    image_id integer,
    cta_label character varying,
    cta_href character varying,
    block_name character varying
);


--
-- Name: pages_blocks_partners_grid; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.pages_blocks_partners_grid (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    _path text NOT NULL,
    id character varying NOT NULL,
    title character varying,
    block_name character varying
);


--
-- Name: pages_blocks_rich_text; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.pages_blocks_rich_text (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    _path text NOT NULL,
    id character varying NOT NULL,
    content jsonb,
    block_name character varying
);


--
-- Name: pages_blocks_video_embed; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.pages_blocks_video_embed (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    _path text NOT NULL,
    id character varying NOT NULL,
    title character varying,
    embed_url character varying,
    block_name character varying
);


--
-- Name: pages_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.pages_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: pages_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.pages_id_seq OWNED BY public.pages.id;


--
-- Name: pages_rels; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.pages_rels (
    id integer NOT NULL,
    "order" integer,
    parent_id integer NOT NULL,
    path character varying NOT NULL,
    documents_id integer,
    partners_id integer
);


--
-- Name: pages_rels_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.pages_rels_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: pages_rels_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.pages_rels_id_seq OWNED BY public.pages_rels.id;


--
-- Name: partners; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.partners (
    id integer NOT NULL,
    name character varying NOT NULL,
    type public.enum_partners_type DEFAULT 'supporter'::public.enum_partners_type NOT NULL,
    logo_id integer,
    url character varying,
    description character varying,
    "order" numeric DEFAULT 0,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL
);


--
-- Name: partners_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.partners_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: partners_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.partners_id_seq OWNED BY public.partners.id;


--
-- Name: payload_folders; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.payload_folders (
    id integer NOT NULL,
    name character varying NOT NULL,
    folder_id integer,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL
);


--
-- Name: payload_folders_folder_type; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.payload_folders_folder_type (
    "order" integer NOT NULL,
    parent_id integer NOT NULL,
    value public.enum_payload_folders_folder_type,
    id integer NOT NULL
);


--
-- Name: payload_folders_folder_type_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.payload_folders_folder_type_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: payload_folders_folder_type_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.payload_folders_folder_type_id_seq OWNED BY public.payload_folders_folder_type.id;


--
-- Name: payload_folders_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.payload_folders_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: payload_folders_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.payload_folders_id_seq OWNED BY public.payload_folders.id;


--
-- Name: payload_kv; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.payload_kv (
    id integer NOT NULL,
    key character varying NOT NULL,
    data jsonb NOT NULL
);


--
-- Name: payload_kv_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.payload_kv_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: payload_kv_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.payload_kv_id_seq OWNED BY public.payload_kv.id;


--
-- Name: payload_locked_documents; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.payload_locked_documents (
    id integer NOT NULL,
    global_slug character varying,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL
);


--
-- Name: payload_locked_documents_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.payload_locked_documents_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: payload_locked_documents_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.payload_locked_documents_id_seq OWNED BY public.payload_locked_documents.id;


--
-- Name: payload_locked_documents_rels; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.payload_locked_documents_rels (
    id integer NOT NULL,
    "order" integer,
    parent_id integer NOT NULL,
    path character varying NOT NULL,
    users_id integer,
    media_id integer,
    libraries_id integer,
    news_id integer,
    events_id integer,
    opening_hours_id integer,
    pages_id integer,
    staff_id integer,
    documents_id integer,
    services_id integer,
    partners_id integer,
    galleries_id integer,
    registrations_id integer,
    rooms_id integer,
    bookings_id integer,
    donation_pledges_id integer,
    products_id integer,
    contact_messages_id integer,
    newsletter_subscribers_id integer,
    payload_folders_id integer,
    wish_requests_id integer,
    wish_comments_id integer
);


--
-- Name: payload_locked_documents_rels_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.payload_locked_documents_rels_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: payload_locked_documents_rels_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.payload_locked_documents_rels_id_seq OWNED BY public.payload_locked_documents_rels.id;


--
-- Name: payload_migrations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.payload_migrations (
    id integer NOT NULL,
    name character varying,
    batch numeric,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL
);


--
-- Name: payload_migrations_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.payload_migrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: payload_migrations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.payload_migrations_id_seq OWNED BY public.payload_migrations.id;


--
-- Name: payload_preferences; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.payload_preferences (
    id integer NOT NULL,
    key character varying,
    value jsonb,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL
);


--
-- Name: payload_preferences_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.payload_preferences_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: payload_preferences_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.payload_preferences_id_seq OWNED BY public.payload_preferences.id;


--
-- Name: payload_preferences_rels; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.payload_preferences_rels (
    id integer NOT NULL,
    "order" integer,
    parent_id integer NOT NULL,
    path character varying NOT NULL,
    users_id integer
);


--
-- Name: payload_preferences_rels_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.payload_preferences_rels_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: payload_preferences_rels_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.payload_preferences_rels_id_seq OWNED BY public.payload_preferences_rels.id;


--
-- Name: products; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.products (
    id integer NOT NULL,
    title character varying NOT NULL,
    slug character varying NOT NULL,
    category public.enum_products_category DEFAULT 'other'::public.enum_products_category NOT NULL,
    price numeric NOT NULL,
    description character varying,
    image_id integer,
    stock_status public.enum_products_stock_status DEFAULT 'available'::public.enum_products_stock_status NOT NULL,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL
);


--
-- Name: products_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.products_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: products_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.products_id_seq OWNED BY public.products.id;


--
-- Name: registrations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.registrations (
    id integer NOT NULL,
    event_id integer NOT NULL,
    name character varying NOT NULL,
    email character varying NOT NULL,
    guest_count numeric DEFAULT 1 NOT NULL,
    status public.enum_registrations_status DEFAULT 'confirmed'::public.enum_registrations_status NOT NULL,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL
);


--
-- Name: registrations_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.registrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: registrations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.registrations_id_seq OWNED BY public.registrations.id;


--
-- Name: rooms; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.rooms (
    id integer NOT NULL,
    name character varying NOT NULL,
    slug character varying NOT NULL,
    library_id integer NOT NULL,
    capacity numeric NOT NULL,
    description character varying,
    image_id integer,
    open_from character varying DEFAULT '09:00'::character varying,
    open_to character varying DEFAULT '18:00'::character varying,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL
);


--
-- Name: rooms_equipment; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.rooms_equipment (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id character varying NOT NULL,
    item character varying NOT NULL
);


--
-- Name: rooms_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.rooms_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: rooms_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.rooms_id_seq OWNED BY public.rooms.id;


--
-- Name: services; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.services (
    id integer NOT NULL,
    title character varying NOT NULL,
    slug character varying NOT NULL,
    short_description character varying NOT NULL,
    rules_pdf_id integer,
    icon character varying,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL
);


--
-- Name: services_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.services_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: services_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.services_id_seq OWNED BY public.services.id;


--
-- Name: services_pricing_table; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.services_pricing_table (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id character varying NOT NULL,
    service_item character varying NOT NULL,
    price character varying NOT NULL
);


--
-- Name: site_metadata; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.site_metadata (
    id integer NOT NULL,
    site_name character varying DEFAULT 'Vörösmarty Mihály Könyvtár'::character varying NOT NULL,
    site_description character varying DEFAULT 'A Vörösmarty Mihály Könyvtár (VMK) Székesfehérvár egyik legnagyobb közkönyvtára. Hírek, rendezvények, tagkönyvtárak és szolgáltatások.'::character varying,
    og_image_id integer,
    canonical_base_url character varying DEFAULT 'https://vmk.hu'::character varying NOT NULL,
    gtm_id character varying,
    ga_id character varying,
    robots_noindex boolean DEFAULT false,
    updated_at timestamp(3) with time zone,
    created_at timestamp(3) with time zone
);


--
-- Name: site_metadata_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.site_metadata_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: site_metadata_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.site_metadata_id_seq OWNED BY public.site_metadata.id;


--
-- Name: staff; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.staff (
    id integer NOT NULL,
    name character varying NOT NULL,
    "position" character varying NOT NULL,
    department_id integer,
    phone character varying,
    email character varying,
    avatar_id integer,
    "order" numeric DEFAULT 0,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    slug character varying
);


--
-- Name: staff_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.staff_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: staff_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.staff_id_seq OWNED BY public.staff.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id integer NOT NULL,
    name character varying NOT NULL,
    role public.enum_users_role DEFAULT 'author'::public.enum_users_role NOT NULL,
    assigned_library_id integer,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    email character varying NOT NULL,
    reset_password_token character varying,
    reset_password_expiration timestamp(3) with time zone,
    salt character varying,
    hash character varying,
    login_attempts numeric DEFAULT 0,
    lock_until timestamp(3) with time zone
);


--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: users_sessions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users_sessions (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id character varying NOT NULL,
    created_at timestamp(3) with time zone,
    expires_at timestamp(3) with time zone NOT NULL
);


--
-- Name: wish_comments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.wish_comments (
    id integer NOT NULL,
    name character varying NOT NULL,
    shown_name character varying,
    email character varying NOT NULL,
    comment character varying NOT NULL,
    status public.enum_wish_comments_status DEFAULT 'pending'::public.enum_wish_comments_status NOT NULL,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL
);


--
-- Name: wish_comments_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.wish_comments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: wish_comments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.wish_comments_id_seq OWNED BY public.wish_comments.id;


--
-- Name: wish_requests; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.wish_requests (
    id integer NOT NULL,
    name character varying NOT NULL,
    shown_name character varying,
    email character varying NOT NULL,
    library_card character varying NOT NULL,
    writer character varying NOT NULL,
    title character varying NOT NULL,
    comment character varying,
    status public.enum_wish_requests_status DEFAULT 'pending'::public.enum_wish_requests_status NOT NULL,
    admin_note character varying,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL
);


--
-- Name: wish_requests_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.wish_requests_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: wish_requests_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.wish_requests_id_seq OWNED BY public.wish_requests.id;


--
-- Name: _events_v id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._events_v ALTER COLUMN id SET DEFAULT nextval('public._events_v_id_seq'::regclass);


--
-- Name: _news_v id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._news_v ALTER COLUMN id SET DEFAULT nextval('public._news_v_id_seq'::regclass);


--
-- Name: _pages_v id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._pages_v ALTER COLUMN id SET DEFAULT nextval('public._pages_v_id_seq'::regclass);


--
-- Name: _pages_v_blocks_accordion id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._pages_v_blocks_accordion ALTER COLUMN id SET DEFAULT nextval('public._pages_v_blocks_accordion_id_seq'::regclass);


--
-- Name: _pages_v_blocks_accordion_items id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._pages_v_blocks_accordion_items ALTER COLUMN id SET DEFAULT nextval('public._pages_v_blocks_accordion_items_id_seq'::regclass);


--
-- Name: _pages_v_blocks_contact_info id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._pages_v_blocks_contact_info ALTER COLUMN id SET DEFAULT nextval('public._pages_v_blocks_contact_info_id_seq'::regclass);


--
-- Name: _pages_v_blocks_downloads id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._pages_v_blocks_downloads ALTER COLUMN id SET DEFAULT nextval('public._pages_v_blocks_downloads_id_seq'::regclass);


--
-- Name: _pages_v_blocks_hero id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._pages_v_blocks_hero ALTER COLUMN id SET DEFAULT nextval('public._pages_v_blocks_hero_id_seq'::regclass);


--
-- Name: _pages_v_blocks_partners_grid id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._pages_v_blocks_partners_grid ALTER COLUMN id SET DEFAULT nextval('public._pages_v_blocks_partners_grid_id_seq'::regclass);


--
-- Name: _pages_v_blocks_rich_text id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._pages_v_blocks_rich_text ALTER COLUMN id SET DEFAULT nextval('public._pages_v_blocks_rich_text_id_seq'::regclass);


--
-- Name: _pages_v_blocks_video_embed id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._pages_v_blocks_video_embed ALTER COLUMN id SET DEFAULT nextval('public._pages_v_blocks_video_embed_id_seq'::regclass);


--
-- Name: _pages_v_rels id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._pages_v_rels ALTER COLUMN id SET DEFAULT nextval('public._pages_v_rels_id_seq'::regclass);


--
-- Name: bookings id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bookings ALTER COLUMN id SET DEFAULT nextval('public.bookings_id_seq'::regclass);


--
-- Name: contact_messages id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.contact_messages ALTER COLUMN id SET DEFAULT nextval('public.contact_messages_id_seq'::regclass);


--
-- Name: documents id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.documents ALTER COLUMN id SET DEFAULT nextval('public.documents_id_seq'::regclass);


--
-- Name: donation_pledges id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.donation_pledges ALTER COLUMN id SET DEFAULT nextval('public.donation_pledges_id_seq'::regclass);


--
-- Name: events id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.events ALTER COLUMN id SET DEFAULT nextval('public.events_id_seq'::regclass);


--
-- Name: footer_settings id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.footer_settings ALTER COLUMN id SET DEFAULT nextval('public.footer_settings_id_seq'::regclass);


--
-- Name: galleries id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.galleries ALTER COLUMN id SET DEFAULT nextval('public.galleries_id_seq'::regclass);


--
-- Name: galleries_rels id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.galleries_rels ALTER COLUMN id SET DEFAULT nextval('public.galleries_rels_id_seq'::regclass);


--
-- Name: header_settings id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.header_settings ALTER COLUMN id SET DEFAULT nextval('public.header_settings_id_seq'::regclass);


--
-- Name: libraries id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.libraries ALTER COLUMN id SET DEFAULT nextval('public.libraries_id_seq'::regclass);


--
-- Name: media id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.media ALTER COLUMN id SET DEFAULT nextval('public.media_id_seq'::regclass);


--
-- Name: news id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.news ALTER COLUMN id SET DEFAULT nextval('public.news_id_seq'::regclass);


--
-- Name: newsletter_subscribers id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.newsletter_subscribers ALTER COLUMN id SET DEFAULT nextval('public.newsletter_subscribers_id_seq'::regclass);


--
-- Name: opening_hours id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.opening_hours ALTER COLUMN id SET DEFAULT nextval('public.opening_hours_id_seq'::regclass);


--
-- Name: opening_hours_global id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.opening_hours_global ALTER COLUMN id SET DEFAULT nextval('public.opening_hours_global_id_seq'::regclass);


--
-- Name: pages id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pages ALTER COLUMN id SET DEFAULT nextval('public.pages_id_seq'::regclass);


--
-- Name: pages_rels id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pages_rels ALTER COLUMN id SET DEFAULT nextval('public.pages_rels_id_seq'::regclass);


--
-- Name: partners id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.partners ALTER COLUMN id SET DEFAULT nextval('public.partners_id_seq'::regclass);


--
-- Name: payload_folders id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payload_folders ALTER COLUMN id SET DEFAULT nextval('public.payload_folders_id_seq'::regclass);


--
-- Name: payload_folders_folder_type id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payload_folders_folder_type ALTER COLUMN id SET DEFAULT nextval('public.payload_folders_folder_type_id_seq'::regclass);


--
-- Name: payload_kv id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payload_kv ALTER COLUMN id SET DEFAULT nextval('public.payload_kv_id_seq'::regclass);


--
-- Name: payload_locked_documents id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payload_locked_documents ALTER COLUMN id SET DEFAULT nextval('public.payload_locked_documents_id_seq'::regclass);


--
-- Name: payload_locked_documents_rels id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payload_locked_documents_rels ALTER COLUMN id SET DEFAULT nextval('public.payload_locked_documents_rels_id_seq'::regclass);


--
-- Name: payload_migrations id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payload_migrations ALTER COLUMN id SET DEFAULT nextval('public.payload_migrations_id_seq'::regclass);


--
-- Name: payload_preferences id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payload_preferences ALTER COLUMN id SET DEFAULT nextval('public.payload_preferences_id_seq'::regclass);


--
-- Name: payload_preferences_rels id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payload_preferences_rels ALTER COLUMN id SET DEFAULT nextval('public.payload_preferences_rels_id_seq'::regclass);


--
-- Name: products id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.products ALTER COLUMN id SET DEFAULT nextval('public.products_id_seq'::regclass);


--
-- Name: registrations id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.registrations ALTER COLUMN id SET DEFAULT nextval('public.registrations_id_seq'::regclass);


--
-- Name: rooms id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.rooms ALTER COLUMN id SET DEFAULT nextval('public.rooms_id_seq'::regclass);


--
-- Name: services id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.services ALTER COLUMN id SET DEFAULT nextval('public.services_id_seq'::regclass);


--
-- Name: site_metadata id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.site_metadata ALTER COLUMN id SET DEFAULT nextval('public.site_metadata_id_seq'::regclass);


--
-- Name: staff id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.staff ALTER COLUMN id SET DEFAULT nextval('public.staff_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Name: wish_comments id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.wish_comments ALTER COLUMN id SET DEFAULT nextval('public.wish_comments_id_seq'::regclass);


--
-- Name: wish_requests id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.wish_requests ALTER COLUMN id SET DEFAULT nextval('public.wish_requests_id_seq'::regclass);


--
-- Name: _events_v _events_v_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._events_v
    ADD CONSTRAINT _events_v_pkey PRIMARY KEY (id);


--
-- Name: _news_v _news_v_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._news_v
    ADD CONSTRAINT _news_v_pkey PRIMARY KEY (id);


--
-- Name: _pages_v_blocks_accordion_items _pages_v_blocks_accordion_items_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._pages_v_blocks_accordion_items
    ADD CONSTRAINT _pages_v_blocks_accordion_items_pkey PRIMARY KEY (id);


--
-- Name: _pages_v_blocks_accordion _pages_v_blocks_accordion_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._pages_v_blocks_accordion
    ADD CONSTRAINT _pages_v_blocks_accordion_pkey PRIMARY KEY (id);


--
-- Name: _pages_v_blocks_contact_info _pages_v_blocks_contact_info_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._pages_v_blocks_contact_info
    ADD CONSTRAINT _pages_v_blocks_contact_info_pkey PRIMARY KEY (id);


--
-- Name: _pages_v_blocks_downloads _pages_v_blocks_downloads_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._pages_v_blocks_downloads
    ADD CONSTRAINT _pages_v_blocks_downloads_pkey PRIMARY KEY (id);


--
-- Name: _pages_v_blocks_hero _pages_v_blocks_hero_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._pages_v_blocks_hero
    ADD CONSTRAINT _pages_v_blocks_hero_pkey PRIMARY KEY (id);


--
-- Name: _pages_v_blocks_partners_grid _pages_v_blocks_partners_grid_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._pages_v_blocks_partners_grid
    ADD CONSTRAINT _pages_v_blocks_partners_grid_pkey PRIMARY KEY (id);


--
-- Name: _pages_v_blocks_rich_text _pages_v_blocks_rich_text_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._pages_v_blocks_rich_text
    ADD CONSTRAINT _pages_v_blocks_rich_text_pkey PRIMARY KEY (id);


--
-- Name: _pages_v_blocks_video_embed _pages_v_blocks_video_embed_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._pages_v_blocks_video_embed
    ADD CONSTRAINT _pages_v_blocks_video_embed_pkey PRIMARY KEY (id);


--
-- Name: _pages_v _pages_v_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._pages_v
    ADD CONSTRAINT _pages_v_pkey PRIMARY KEY (id);


--
-- Name: _pages_v_rels _pages_v_rels_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._pages_v_rels
    ADD CONSTRAINT _pages_v_rels_pkey PRIMARY KEY (id);


--
-- Name: bookings bookings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_pkey PRIMARY KEY (id);


--
-- Name: contact_messages contact_messages_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.contact_messages
    ADD CONSTRAINT contact_messages_pkey PRIMARY KEY (id);


--
-- Name: documents documents_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.documents
    ADD CONSTRAINT documents_pkey PRIMARY KEY (id);


--
-- Name: donation_pledges donation_pledges_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.donation_pledges
    ADD CONSTRAINT donation_pledges_pkey PRIMARY KEY (id);


--
-- Name: events events_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.events
    ADD CONSTRAINT events_pkey PRIMARY KEY (id);


--
-- Name: footer_settings footer_settings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.footer_settings
    ADD CONSTRAINT footer_settings_pkey PRIMARY KEY (id);


--
-- Name: footer_settings_quick_links footer_settings_quick_links_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.footer_settings_quick_links
    ADD CONSTRAINT footer_settings_quick_links_pkey PRIMARY KEY (id);


--
-- Name: galleries galleries_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.galleries
    ADD CONSTRAINT galleries_pkey PRIMARY KEY (id);


--
-- Name: galleries_rels galleries_rels_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.galleries_rels
    ADD CONSTRAINT galleries_rels_pkey PRIMARY KEY (id);


--
-- Name: header_settings_nav_items header_settings_nav_items_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.header_settings_nav_items
    ADD CONSTRAINT header_settings_nav_items_pkey PRIMARY KEY (id);


--
-- Name: header_settings header_settings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.header_settings
    ADD CONSTRAINT header_settings_pkey PRIMARY KEY (id);


--
-- Name: libraries libraries_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.libraries
    ADD CONSTRAINT libraries_pkey PRIMARY KEY (id);


--
-- Name: media media_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.media
    ADD CONSTRAINT media_pkey PRIMARY KEY (id);


--
-- Name: news news_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.news
    ADD CONSTRAINT news_pkey PRIMARY KEY (id);


--
-- Name: newsletter_subscribers newsletter_subscribers_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.newsletter_subscribers
    ADD CONSTRAINT newsletter_subscribers_pkey PRIMARY KEY (id);


--
-- Name: opening_hours_global opening_hours_global_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.opening_hours_global
    ADD CONSTRAINT opening_hours_global_pkey PRIMARY KEY (id);


--
-- Name: opening_hours_global_special_periods opening_hours_global_special_periods_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.opening_hours_global_special_periods
    ADD CONSTRAINT opening_hours_global_special_periods_pkey PRIMARY KEY (id);


--
-- Name: opening_hours opening_hours_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.opening_hours
    ADD CONSTRAINT opening_hours_pkey PRIMARY KEY (id);


--
-- Name: pages_blocks_accordion_items pages_blocks_accordion_items_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pages_blocks_accordion_items
    ADD CONSTRAINT pages_blocks_accordion_items_pkey PRIMARY KEY (id);


--
-- Name: pages_blocks_accordion pages_blocks_accordion_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pages_blocks_accordion
    ADD CONSTRAINT pages_blocks_accordion_pkey PRIMARY KEY (id);


--
-- Name: pages_blocks_contact_info pages_blocks_contact_info_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pages_blocks_contact_info
    ADD CONSTRAINT pages_blocks_contact_info_pkey PRIMARY KEY (id);


--
-- Name: pages_blocks_downloads pages_blocks_downloads_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pages_blocks_downloads
    ADD CONSTRAINT pages_blocks_downloads_pkey PRIMARY KEY (id);


--
-- Name: pages_blocks_hero pages_blocks_hero_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pages_blocks_hero
    ADD CONSTRAINT pages_blocks_hero_pkey PRIMARY KEY (id);


--
-- Name: pages_blocks_partners_grid pages_blocks_partners_grid_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pages_blocks_partners_grid
    ADD CONSTRAINT pages_blocks_partners_grid_pkey PRIMARY KEY (id);


--
-- Name: pages_blocks_rich_text pages_blocks_rich_text_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pages_blocks_rich_text
    ADD CONSTRAINT pages_blocks_rich_text_pkey PRIMARY KEY (id);


--
-- Name: pages_blocks_video_embed pages_blocks_video_embed_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pages_blocks_video_embed
    ADD CONSTRAINT pages_blocks_video_embed_pkey PRIMARY KEY (id);


--
-- Name: pages pages_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pages
    ADD CONSTRAINT pages_pkey PRIMARY KEY (id);


--
-- Name: pages_rels pages_rels_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pages_rels
    ADD CONSTRAINT pages_rels_pkey PRIMARY KEY (id);


--
-- Name: partners partners_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.partners
    ADD CONSTRAINT partners_pkey PRIMARY KEY (id);


--
-- Name: payload_folders_folder_type payload_folders_folder_type_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payload_folders_folder_type
    ADD CONSTRAINT payload_folders_folder_type_pkey PRIMARY KEY (id);


--
-- Name: payload_folders payload_folders_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payload_folders
    ADD CONSTRAINT payload_folders_pkey PRIMARY KEY (id);


--
-- Name: payload_kv payload_kv_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payload_kv
    ADD CONSTRAINT payload_kv_pkey PRIMARY KEY (id);


--
-- Name: payload_locked_documents payload_locked_documents_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payload_locked_documents
    ADD CONSTRAINT payload_locked_documents_pkey PRIMARY KEY (id);


--
-- Name: payload_locked_documents_rels payload_locked_documents_rels_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payload_locked_documents_rels
    ADD CONSTRAINT payload_locked_documents_rels_pkey PRIMARY KEY (id);


--
-- Name: payload_migrations payload_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payload_migrations
    ADD CONSTRAINT payload_migrations_pkey PRIMARY KEY (id);


--
-- Name: payload_preferences payload_preferences_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payload_preferences
    ADD CONSTRAINT payload_preferences_pkey PRIMARY KEY (id);


--
-- Name: payload_preferences_rels payload_preferences_rels_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payload_preferences_rels
    ADD CONSTRAINT payload_preferences_rels_pkey PRIMARY KEY (id);


--
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);


--
-- Name: registrations registrations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.registrations
    ADD CONSTRAINT registrations_pkey PRIMARY KEY (id);


--
-- Name: rooms_equipment rooms_equipment_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.rooms_equipment
    ADD CONSTRAINT rooms_equipment_pkey PRIMARY KEY (id);


--
-- Name: rooms rooms_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.rooms
    ADD CONSTRAINT rooms_pkey PRIMARY KEY (id);


--
-- Name: services services_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.services
    ADD CONSTRAINT services_pkey PRIMARY KEY (id);


--
-- Name: services_pricing_table services_pricing_table_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.services_pricing_table
    ADD CONSTRAINT services_pricing_table_pkey PRIMARY KEY (id);


--
-- Name: site_metadata site_metadata_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.site_metadata
    ADD CONSTRAINT site_metadata_pkey PRIMARY KEY (id);


--
-- Name: staff staff_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.staff
    ADD CONSTRAINT staff_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users_sessions users_sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users_sessions
    ADD CONSTRAINT users_sessions_pkey PRIMARY KEY (id);


--
-- Name: wish_comments wish_comments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.wish_comments
    ADD CONSTRAINT wish_comments_pkey PRIMARY KEY (id);


--
-- Name: wish_requests wish_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.wish_requests
    ADD CONSTRAINT wish_requests_pkey PRIMARY KEY (id);


--
-- Name: _events_v_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _events_v_created_at_idx ON public._events_v USING btree (created_at);


--
-- Name: _events_v_latest_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _events_v_latest_idx ON public._events_v USING btree (latest);


--
-- Name: _events_v_parent_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _events_v_parent_idx ON public._events_v USING btree (parent_id);


--
-- Name: _events_v_updated_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _events_v_updated_at_idx ON public._events_v USING btree (updated_at);


--
-- Name: _events_v_version_version__status_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _events_v_version_version__status_idx ON public._events_v USING btree (version__status);


--
-- Name: _events_v_version_version_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _events_v_version_version_created_at_idx ON public._events_v USING btree (version_created_at);


--
-- Name: _events_v_version_version_featured_image_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _events_v_version_version_featured_image_idx ON public._events_v USING btree (version_featured_image_id);


--
-- Name: _events_v_version_version_location_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _events_v_version_version_location_idx ON public._events_v USING btree (version_location_id);


--
-- Name: _events_v_version_version_slug_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _events_v_version_version_slug_idx ON public._events_v USING btree (version_slug);


--
-- Name: _events_v_version_version_updated_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _events_v_version_version_updated_at_idx ON public._events_v USING btree (version_updated_at);


--
-- Name: _news_v_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _news_v_created_at_idx ON public._news_v USING btree (created_at);


--
-- Name: _news_v_latest_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _news_v_latest_idx ON public._news_v USING btree (latest);


--
-- Name: _news_v_parent_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _news_v_parent_idx ON public._news_v USING btree (parent_id);


--
-- Name: _news_v_updated_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _news_v_updated_at_idx ON public._news_v USING btree (updated_at);


--
-- Name: _news_v_version_version__status_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _news_v_version_version__status_idx ON public._news_v USING btree (version__status);


--
-- Name: _news_v_version_version_author_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _news_v_version_version_author_idx ON public._news_v USING btree (version_author_id);


--
-- Name: _news_v_version_version_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _news_v_version_version_created_at_idx ON public._news_v USING btree (version_created_at);


--
-- Name: _news_v_version_version_featured_image_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _news_v_version_version_featured_image_idx ON public._news_v USING btree (version_featured_image_id);


--
-- Name: _news_v_version_version_related_library_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _news_v_version_version_related_library_idx ON public._news_v USING btree (version_related_library_id);


--
-- Name: _news_v_version_version_slug_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _news_v_version_version_slug_idx ON public._news_v USING btree (version_slug);


--
-- Name: _news_v_version_version_updated_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _news_v_version_version_updated_at_idx ON public._news_v USING btree (version_updated_at);


--
-- Name: _pages_v_blocks_accordion_items_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _pages_v_blocks_accordion_items_order_idx ON public._pages_v_blocks_accordion_items USING btree (_order);


--
-- Name: _pages_v_blocks_accordion_items_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _pages_v_blocks_accordion_items_parent_id_idx ON public._pages_v_blocks_accordion_items USING btree (_parent_id);


--
-- Name: _pages_v_blocks_accordion_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _pages_v_blocks_accordion_order_idx ON public._pages_v_blocks_accordion USING btree (_order);


--
-- Name: _pages_v_blocks_accordion_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _pages_v_blocks_accordion_parent_id_idx ON public._pages_v_blocks_accordion USING btree (_parent_id);


--
-- Name: _pages_v_blocks_accordion_path_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _pages_v_blocks_accordion_path_idx ON public._pages_v_blocks_accordion USING btree (_path);


--
-- Name: _pages_v_blocks_contact_info_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _pages_v_blocks_contact_info_order_idx ON public._pages_v_blocks_contact_info USING btree (_order);


--
-- Name: _pages_v_blocks_contact_info_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _pages_v_blocks_contact_info_parent_id_idx ON public._pages_v_blocks_contact_info USING btree (_parent_id);


--
-- Name: _pages_v_blocks_contact_info_path_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _pages_v_blocks_contact_info_path_idx ON public._pages_v_blocks_contact_info USING btree (_path);


--
-- Name: _pages_v_blocks_downloads_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _pages_v_blocks_downloads_order_idx ON public._pages_v_blocks_downloads USING btree (_order);


--
-- Name: _pages_v_blocks_downloads_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _pages_v_blocks_downloads_parent_id_idx ON public._pages_v_blocks_downloads USING btree (_parent_id);


--
-- Name: _pages_v_blocks_downloads_path_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _pages_v_blocks_downloads_path_idx ON public._pages_v_blocks_downloads USING btree (_path);


--
-- Name: _pages_v_blocks_hero_image_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _pages_v_blocks_hero_image_idx ON public._pages_v_blocks_hero USING btree (image_id);


--
-- Name: _pages_v_blocks_hero_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _pages_v_blocks_hero_order_idx ON public._pages_v_blocks_hero USING btree (_order);


--
-- Name: _pages_v_blocks_hero_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _pages_v_blocks_hero_parent_id_idx ON public._pages_v_blocks_hero USING btree (_parent_id);


--
-- Name: _pages_v_blocks_hero_path_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _pages_v_blocks_hero_path_idx ON public._pages_v_blocks_hero USING btree (_path);


--
-- Name: _pages_v_blocks_partners_grid_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _pages_v_blocks_partners_grid_order_idx ON public._pages_v_blocks_partners_grid USING btree (_order);


--
-- Name: _pages_v_blocks_partners_grid_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _pages_v_blocks_partners_grid_parent_id_idx ON public._pages_v_blocks_partners_grid USING btree (_parent_id);


--
-- Name: _pages_v_blocks_partners_grid_path_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _pages_v_blocks_partners_grid_path_idx ON public._pages_v_blocks_partners_grid USING btree (_path);


--
-- Name: _pages_v_blocks_rich_text_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _pages_v_blocks_rich_text_order_idx ON public._pages_v_blocks_rich_text USING btree (_order);


--
-- Name: _pages_v_blocks_rich_text_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _pages_v_blocks_rich_text_parent_id_idx ON public._pages_v_blocks_rich_text USING btree (_parent_id);


--
-- Name: _pages_v_blocks_rich_text_path_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _pages_v_blocks_rich_text_path_idx ON public._pages_v_blocks_rich_text USING btree (_path);


--
-- Name: _pages_v_blocks_video_embed_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _pages_v_blocks_video_embed_order_idx ON public._pages_v_blocks_video_embed USING btree (_order);


--
-- Name: _pages_v_blocks_video_embed_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _pages_v_blocks_video_embed_parent_id_idx ON public._pages_v_blocks_video_embed USING btree (_parent_id);


--
-- Name: _pages_v_blocks_video_embed_path_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _pages_v_blocks_video_embed_path_idx ON public._pages_v_blocks_video_embed USING btree (_path);


--
-- Name: _pages_v_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _pages_v_created_at_idx ON public._pages_v USING btree (created_at);


--
-- Name: _pages_v_latest_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _pages_v_latest_idx ON public._pages_v USING btree (latest);


--
-- Name: _pages_v_parent_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _pages_v_parent_idx ON public._pages_v USING btree (parent_id);


--
-- Name: _pages_v_rels_documents_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _pages_v_rels_documents_id_idx ON public._pages_v_rels USING btree (documents_id);


--
-- Name: _pages_v_rels_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _pages_v_rels_order_idx ON public._pages_v_rels USING btree ("order");


--
-- Name: _pages_v_rels_parent_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _pages_v_rels_parent_idx ON public._pages_v_rels USING btree (parent_id);


--
-- Name: _pages_v_rels_partners_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _pages_v_rels_partners_id_idx ON public._pages_v_rels USING btree (partners_id);


--
-- Name: _pages_v_rels_path_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _pages_v_rels_path_idx ON public._pages_v_rels USING btree (path);


--
-- Name: _pages_v_updated_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _pages_v_updated_at_idx ON public._pages_v USING btree (updated_at);


--
-- Name: _pages_v_version_version__status_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _pages_v_version_version__status_idx ON public._pages_v USING btree (version__status);


--
-- Name: _pages_v_version_version_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _pages_v_version_version_created_at_idx ON public._pages_v USING btree (version_created_at);


--
-- Name: _pages_v_version_version_slug_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _pages_v_version_version_slug_idx ON public._pages_v USING btree (version_slug);


--
-- Name: _pages_v_version_version_updated_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _pages_v_version_version_updated_at_idx ON public._pages_v USING btree (version_updated_at);


--
-- Name: bookings_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX bookings_created_at_idx ON public.bookings USING btree (created_at);


--
-- Name: bookings_room_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX bookings_room_idx ON public.bookings USING btree (room_id);


--
-- Name: bookings_updated_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX bookings_updated_at_idx ON public.bookings USING btree (updated_at);


--
-- Name: contact_messages_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX contact_messages_created_at_idx ON public.contact_messages USING btree (created_at);


--
-- Name: contact_messages_updated_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX contact_messages_updated_at_idx ON public.contact_messages USING btree (updated_at);


--
-- Name: documents_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX documents_created_at_idx ON public.documents USING btree (created_at);


--
-- Name: documents_file_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX documents_file_idx ON public.documents USING btree (file_id);


--
-- Name: documents_source_url_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX documents_source_url_idx ON public.documents USING btree (source_url);


--
-- Name: documents_updated_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX documents_updated_at_idx ON public.documents USING btree (updated_at);


--
-- Name: donation_pledges_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX donation_pledges_created_at_idx ON public.donation_pledges USING btree (created_at);


--
-- Name: donation_pledges_updated_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX donation_pledges_updated_at_idx ON public.donation_pledges USING btree (updated_at);


--
-- Name: events__status_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX events__status_idx ON public.events USING btree (_status);


--
-- Name: events_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX events_created_at_idx ON public.events USING btree (created_at);


--
-- Name: events_featured_image_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX events_featured_image_idx ON public.events USING btree (featured_image_id);


--
-- Name: events_location_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX events_location_idx ON public.events USING btree (location_id);


--
-- Name: events_slug_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX events_slug_idx ON public.events USING btree (slug);


--
-- Name: events_updated_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX events_updated_at_idx ON public.events USING btree (updated_at);


--
-- Name: footer_settings_quick_links_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX footer_settings_quick_links_order_idx ON public.footer_settings_quick_links USING btree (_order);


--
-- Name: footer_settings_quick_links_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX footer_settings_quick_links_parent_id_idx ON public.footer_settings_quick_links USING btree (_parent_id);


--
-- Name: galleries_cover_image_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX galleries_cover_image_idx ON public.galleries USING btree (cover_image_id);


--
-- Name: galleries_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX galleries_created_at_idx ON public.galleries USING btree (created_at);


--
-- Name: galleries_folder_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX galleries_folder_idx ON public.galleries USING btree (folder_id);


--
-- Name: galleries_related_event_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX galleries_related_event_idx ON public.galleries USING btree (related_event_id);


--
-- Name: galleries_rels_media_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX galleries_rels_media_id_idx ON public.galleries_rels USING btree (media_id);


--
-- Name: galleries_rels_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX galleries_rels_order_idx ON public.galleries_rels USING btree ("order");


--
-- Name: galleries_rels_parent_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX galleries_rels_parent_idx ON public.galleries_rels USING btree (parent_id);


--
-- Name: galleries_rels_path_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX galleries_rels_path_idx ON public.galleries_rels USING btree (path);


--
-- Name: galleries_slug_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX galleries_slug_idx ON public.galleries USING btree (slug);


--
-- Name: galleries_updated_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX galleries_updated_at_idx ON public.galleries USING btree (updated_at);


--
-- Name: header_settings_nav_items_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX header_settings_nav_items_order_idx ON public.header_settings_nav_items USING btree (_order);


--
-- Name: header_settings_nav_items_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX header_settings_nav_items_parent_id_idx ON public.header_settings_nav_items USING btree (_parent_id);


--
-- Name: libraries_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX libraries_created_at_idx ON public.libraries USING btree (created_at);


--
-- Name: libraries_featured_image_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX libraries_featured_image_idx ON public.libraries USING btree (featured_image_id);


--
-- Name: libraries_slug_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX libraries_slug_idx ON public.libraries USING btree (slug);


--
-- Name: libraries_updated_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX libraries_updated_at_idx ON public.libraries USING btree (updated_at);


--
-- Name: media_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX media_created_at_idx ON public.media USING btree (created_at);


--
-- Name: media_filename_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX media_filename_idx ON public.media USING btree (filename);


--
-- Name: media_folder_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX media_folder_idx ON public.media USING btree (folder_id);


--
-- Name: media_sizes_card_sizes_card_filename_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX media_sizes_card_sizes_card_filename_idx ON public.media USING btree (sizes_card_filename);


--
-- Name: media_sizes_hero_sizes_hero_filename_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX media_sizes_hero_sizes_hero_filename_idx ON public.media USING btree (sizes_hero_filename);


--
-- Name: media_sizes_thumbnail_sizes_thumbnail_filename_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX media_sizes_thumbnail_sizes_thumbnail_filename_idx ON public.media USING btree (sizes_thumbnail_filename);


--
-- Name: media_updated_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX media_updated_at_idx ON public.media USING btree (updated_at);


--
-- Name: news__status_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX news__status_idx ON public.news USING btree (_status);


--
-- Name: news_author_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX news_author_idx ON public.news USING btree (author_id);


--
-- Name: news_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX news_created_at_idx ON public.news USING btree (created_at);


--
-- Name: news_featured_image_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX news_featured_image_idx ON public.news USING btree (featured_image_id);


--
-- Name: news_related_library_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX news_related_library_idx ON public.news USING btree (related_library_id);


--
-- Name: news_slug_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX news_slug_idx ON public.news USING btree (slug);


--
-- Name: news_updated_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX news_updated_at_idx ON public.news USING btree (updated_at);


--
-- Name: newsletter_subscribers_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX newsletter_subscribers_created_at_idx ON public.newsletter_subscribers USING btree (created_at);


--
-- Name: newsletter_subscribers_email_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX newsletter_subscribers_email_idx ON public.newsletter_subscribers USING btree (email);


--
-- Name: newsletter_subscribers_updated_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX newsletter_subscribers_updated_at_idx ON public.newsletter_subscribers USING btree (updated_at);


--
-- Name: opening_hours_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX opening_hours_created_at_idx ON public.opening_hours USING btree (created_at);


--
-- Name: opening_hours_global_special_periods_affected_library_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX opening_hours_global_special_periods_affected_library_idx ON public.opening_hours_global_special_periods USING btree (affected_library_id);


--
-- Name: opening_hours_global_special_periods_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX opening_hours_global_special_periods_order_idx ON public.opening_hours_global_special_periods USING btree (_order);


--
-- Name: opening_hours_global_special_periods_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX opening_hours_global_special_periods_parent_id_idx ON public.opening_hours_global_special_periods USING btree (_parent_id);


--
-- Name: opening_hours_library_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX opening_hours_library_idx ON public.opening_hours USING btree (library_id);


--
-- Name: opening_hours_updated_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX opening_hours_updated_at_idx ON public.opening_hours USING btree (updated_at);


--
-- Name: pages__status_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX pages__status_idx ON public.pages USING btree (_status);


--
-- Name: pages_blocks_accordion_items_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX pages_blocks_accordion_items_order_idx ON public.pages_blocks_accordion_items USING btree (_order);


--
-- Name: pages_blocks_accordion_items_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX pages_blocks_accordion_items_parent_id_idx ON public.pages_blocks_accordion_items USING btree (_parent_id);


--
-- Name: pages_blocks_accordion_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX pages_blocks_accordion_order_idx ON public.pages_blocks_accordion USING btree (_order);


--
-- Name: pages_blocks_accordion_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX pages_blocks_accordion_parent_id_idx ON public.pages_blocks_accordion USING btree (_parent_id);


--
-- Name: pages_blocks_accordion_path_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX pages_blocks_accordion_path_idx ON public.pages_blocks_accordion USING btree (_path);


--
-- Name: pages_blocks_contact_info_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX pages_blocks_contact_info_order_idx ON public.pages_blocks_contact_info USING btree (_order);


--
-- Name: pages_blocks_contact_info_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX pages_blocks_contact_info_parent_id_idx ON public.pages_blocks_contact_info USING btree (_parent_id);


--
-- Name: pages_blocks_contact_info_path_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX pages_blocks_contact_info_path_idx ON public.pages_blocks_contact_info USING btree (_path);


--
-- Name: pages_blocks_downloads_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX pages_blocks_downloads_order_idx ON public.pages_blocks_downloads USING btree (_order);


--
-- Name: pages_blocks_downloads_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX pages_blocks_downloads_parent_id_idx ON public.pages_blocks_downloads USING btree (_parent_id);


--
-- Name: pages_blocks_downloads_path_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX pages_blocks_downloads_path_idx ON public.pages_blocks_downloads USING btree (_path);


--
-- Name: pages_blocks_hero_image_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX pages_blocks_hero_image_idx ON public.pages_blocks_hero USING btree (image_id);


--
-- Name: pages_blocks_hero_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX pages_blocks_hero_order_idx ON public.pages_blocks_hero USING btree (_order);


--
-- Name: pages_blocks_hero_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX pages_blocks_hero_parent_id_idx ON public.pages_blocks_hero USING btree (_parent_id);


--
-- Name: pages_blocks_hero_path_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX pages_blocks_hero_path_idx ON public.pages_blocks_hero USING btree (_path);


--
-- Name: pages_blocks_partners_grid_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX pages_blocks_partners_grid_order_idx ON public.pages_blocks_partners_grid USING btree (_order);


--
-- Name: pages_blocks_partners_grid_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX pages_blocks_partners_grid_parent_id_idx ON public.pages_blocks_partners_grid USING btree (_parent_id);


--
-- Name: pages_blocks_partners_grid_path_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX pages_blocks_partners_grid_path_idx ON public.pages_blocks_partners_grid USING btree (_path);


--
-- Name: pages_blocks_rich_text_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX pages_blocks_rich_text_order_idx ON public.pages_blocks_rich_text USING btree (_order);


--
-- Name: pages_blocks_rich_text_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX pages_blocks_rich_text_parent_id_idx ON public.pages_blocks_rich_text USING btree (_parent_id);


--
-- Name: pages_blocks_rich_text_path_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX pages_blocks_rich_text_path_idx ON public.pages_blocks_rich_text USING btree (_path);


--
-- Name: pages_blocks_video_embed_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX pages_blocks_video_embed_order_idx ON public.pages_blocks_video_embed USING btree (_order);


--
-- Name: pages_blocks_video_embed_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX pages_blocks_video_embed_parent_id_idx ON public.pages_blocks_video_embed USING btree (_parent_id);


--
-- Name: pages_blocks_video_embed_path_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX pages_blocks_video_embed_path_idx ON public.pages_blocks_video_embed USING btree (_path);


--
-- Name: pages_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX pages_created_at_idx ON public.pages USING btree (created_at);


--
-- Name: pages_rels_documents_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX pages_rels_documents_id_idx ON public.pages_rels USING btree (documents_id);


--
-- Name: pages_rels_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX pages_rels_order_idx ON public.pages_rels USING btree ("order");


--
-- Name: pages_rels_parent_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX pages_rels_parent_idx ON public.pages_rels USING btree (parent_id);


--
-- Name: pages_rels_partners_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX pages_rels_partners_id_idx ON public.pages_rels USING btree (partners_id);


--
-- Name: pages_rels_path_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX pages_rels_path_idx ON public.pages_rels USING btree (path);


--
-- Name: pages_slug_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX pages_slug_idx ON public.pages USING btree (slug);


--
-- Name: pages_updated_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX pages_updated_at_idx ON public.pages USING btree (updated_at);


--
-- Name: partners_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partners_created_at_idx ON public.partners USING btree (created_at);


--
-- Name: partners_logo_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partners_logo_idx ON public.partners USING btree (logo_id);


--
-- Name: partners_updated_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partners_updated_at_idx ON public.partners USING btree (updated_at);


--
-- Name: payload_folders_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_folders_created_at_idx ON public.payload_folders USING btree (created_at);


--
-- Name: payload_folders_folder_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_folders_folder_idx ON public.payload_folders USING btree (folder_id);


--
-- Name: payload_folders_folder_type_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_folders_folder_type_order_idx ON public.payload_folders_folder_type USING btree ("order");


--
-- Name: payload_folders_folder_type_parent_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_folders_folder_type_parent_idx ON public.payload_folders_folder_type USING btree (parent_id);


--
-- Name: payload_folders_name_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_folders_name_idx ON public.payload_folders USING btree (name);


--
-- Name: payload_folders_updated_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_folders_updated_at_idx ON public.payload_folders USING btree (updated_at);


--
-- Name: payload_kv_key_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX payload_kv_key_idx ON public.payload_kv USING btree (key);


--
-- Name: payload_locked_documents_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_locked_documents_created_at_idx ON public.payload_locked_documents USING btree (created_at);


--
-- Name: payload_locked_documents_global_slug_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_locked_documents_global_slug_idx ON public.payload_locked_documents USING btree (global_slug);


--
-- Name: payload_locked_documents_rels_bookings_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_locked_documents_rels_bookings_id_idx ON public.payload_locked_documents_rels USING btree (bookings_id);


--
-- Name: payload_locked_documents_rels_contact_messages_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_locked_documents_rels_contact_messages_id_idx ON public.payload_locked_documents_rels USING btree (contact_messages_id);


--
-- Name: payload_locked_documents_rels_documents_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_locked_documents_rels_documents_id_idx ON public.payload_locked_documents_rels USING btree (documents_id);


--
-- Name: payload_locked_documents_rels_donation_pledges_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_locked_documents_rels_donation_pledges_id_idx ON public.payload_locked_documents_rels USING btree (donation_pledges_id);


--
-- Name: payload_locked_documents_rels_events_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_locked_documents_rels_events_id_idx ON public.payload_locked_documents_rels USING btree (events_id);


--
-- Name: payload_locked_documents_rels_galleries_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_locked_documents_rels_galleries_id_idx ON public.payload_locked_documents_rels USING btree (galleries_id);


--
-- Name: payload_locked_documents_rels_libraries_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_locked_documents_rels_libraries_id_idx ON public.payload_locked_documents_rels USING btree (libraries_id);


--
-- Name: payload_locked_documents_rels_media_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_locked_documents_rels_media_id_idx ON public.payload_locked_documents_rels USING btree (media_id);


--
-- Name: payload_locked_documents_rels_news_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_locked_documents_rels_news_id_idx ON public.payload_locked_documents_rels USING btree (news_id);


--
-- Name: payload_locked_documents_rels_newsletter_subscribers_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_locked_documents_rels_newsletter_subscribers_id_idx ON public.payload_locked_documents_rels USING btree (newsletter_subscribers_id);


--
-- Name: payload_locked_documents_rels_opening_hours_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_locked_documents_rels_opening_hours_id_idx ON public.payload_locked_documents_rels USING btree (opening_hours_id);


--
-- Name: payload_locked_documents_rels_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_locked_documents_rels_order_idx ON public.payload_locked_documents_rels USING btree ("order");


--
-- Name: payload_locked_documents_rels_pages_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_locked_documents_rels_pages_id_idx ON public.payload_locked_documents_rels USING btree (pages_id);


--
-- Name: payload_locked_documents_rels_parent_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_locked_documents_rels_parent_idx ON public.payload_locked_documents_rels USING btree (parent_id);


--
-- Name: payload_locked_documents_rels_partners_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_locked_documents_rels_partners_id_idx ON public.payload_locked_documents_rels USING btree (partners_id);


--
-- Name: payload_locked_documents_rels_path_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_locked_documents_rels_path_idx ON public.payload_locked_documents_rels USING btree (path);


--
-- Name: payload_locked_documents_rels_payload_folders_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_locked_documents_rels_payload_folders_id_idx ON public.payload_locked_documents_rels USING btree (payload_folders_id);


--
-- Name: payload_locked_documents_rels_products_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_locked_documents_rels_products_id_idx ON public.payload_locked_documents_rels USING btree (products_id);


--
-- Name: payload_locked_documents_rels_registrations_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_locked_documents_rels_registrations_id_idx ON public.payload_locked_documents_rels USING btree (registrations_id);


--
-- Name: payload_locked_documents_rels_rooms_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_locked_documents_rels_rooms_id_idx ON public.payload_locked_documents_rels USING btree (rooms_id);


--
-- Name: payload_locked_documents_rels_services_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_locked_documents_rels_services_id_idx ON public.payload_locked_documents_rels USING btree (services_id);


--
-- Name: payload_locked_documents_rels_staff_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_locked_documents_rels_staff_id_idx ON public.payload_locked_documents_rels USING btree (staff_id);


--
-- Name: payload_locked_documents_rels_users_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_locked_documents_rels_users_id_idx ON public.payload_locked_documents_rels USING btree (users_id);


--
-- Name: payload_locked_documents_rels_wish_comments_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_locked_documents_rels_wish_comments_id_idx ON public.payload_locked_documents_rels USING btree (wish_comments_id);


--
-- Name: payload_locked_documents_rels_wish_requests_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_locked_documents_rels_wish_requests_id_idx ON public.payload_locked_documents_rels USING btree (wish_requests_id);


--
-- Name: payload_locked_documents_updated_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_locked_documents_updated_at_idx ON public.payload_locked_documents USING btree (updated_at);


--
-- Name: payload_migrations_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_migrations_created_at_idx ON public.payload_migrations USING btree (created_at);


--
-- Name: payload_migrations_updated_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_migrations_updated_at_idx ON public.payload_migrations USING btree (updated_at);


--
-- Name: payload_preferences_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_preferences_created_at_idx ON public.payload_preferences USING btree (created_at);


--
-- Name: payload_preferences_key_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_preferences_key_idx ON public.payload_preferences USING btree (key);


--
-- Name: payload_preferences_rels_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_preferences_rels_order_idx ON public.payload_preferences_rels USING btree ("order");


--
-- Name: payload_preferences_rels_parent_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_preferences_rels_parent_idx ON public.payload_preferences_rels USING btree (parent_id);


--
-- Name: payload_preferences_rels_path_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_preferences_rels_path_idx ON public.payload_preferences_rels USING btree (path);


--
-- Name: payload_preferences_rels_users_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_preferences_rels_users_id_idx ON public.payload_preferences_rels USING btree (users_id);


--
-- Name: payload_preferences_updated_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_preferences_updated_at_idx ON public.payload_preferences USING btree (updated_at);


--
-- Name: products_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX products_created_at_idx ON public.products USING btree (created_at);


--
-- Name: products_image_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX products_image_idx ON public.products USING btree (image_id);


--
-- Name: products_slug_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX products_slug_idx ON public.products USING btree (slug);


--
-- Name: products_updated_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX products_updated_at_idx ON public.products USING btree (updated_at);


--
-- Name: registrations_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX registrations_created_at_idx ON public.registrations USING btree (created_at);


--
-- Name: registrations_event_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX registrations_event_idx ON public.registrations USING btree (event_id);


--
-- Name: registrations_updated_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX registrations_updated_at_idx ON public.registrations USING btree (updated_at);


--
-- Name: rooms_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX rooms_created_at_idx ON public.rooms USING btree (created_at);


--
-- Name: rooms_equipment_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX rooms_equipment_order_idx ON public.rooms_equipment USING btree (_order);


--
-- Name: rooms_equipment_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX rooms_equipment_parent_id_idx ON public.rooms_equipment USING btree (_parent_id);


--
-- Name: rooms_image_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX rooms_image_idx ON public.rooms USING btree (image_id);


--
-- Name: rooms_library_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX rooms_library_idx ON public.rooms USING btree (library_id);


--
-- Name: rooms_slug_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX rooms_slug_idx ON public.rooms USING btree (slug);


--
-- Name: rooms_updated_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX rooms_updated_at_idx ON public.rooms USING btree (updated_at);


--
-- Name: services_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX services_created_at_idx ON public.services USING btree (created_at);


--
-- Name: services_pricing_table_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX services_pricing_table_order_idx ON public.services_pricing_table USING btree (_order);


--
-- Name: services_pricing_table_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX services_pricing_table_parent_id_idx ON public.services_pricing_table USING btree (_parent_id);


--
-- Name: services_rules_pdf_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX services_rules_pdf_idx ON public.services USING btree (rules_pdf_id);


--
-- Name: services_slug_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX services_slug_idx ON public.services USING btree (slug);


--
-- Name: services_updated_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX services_updated_at_idx ON public.services USING btree (updated_at);


--
-- Name: site_metadata_og_image_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX site_metadata_og_image_idx ON public.site_metadata USING btree (og_image_id);


--
-- Name: staff_avatar_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX staff_avatar_idx ON public.staff USING btree (avatar_id);


--
-- Name: staff_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX staff_created_at_idx ON public.staff USING btree (created_at);


--
-- Name: staff_department_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX staff_department_idx ON public.staff USING btree (department_id);


--
-- Name: staff_slug_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX staff_slug_idx ON public.staff USING btree (slug);


--
-- Name: staff_updated_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX staff_updated_at_idx ON public.staff USING btree (updated_at);


--
-- Name: users_assigned_library_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX users_assigned_library_idx ON public.users USING btree (assigned_library_id);


--
-- Name: users_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX users_created_at_idx ON public.users USING btree (created_at);


--
-- Name: users_email_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX users_email_idx ON public.users USING btree (email);


--
-- Name: users_sessions_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX users_sessions_order_idx ON public.users_sessions USING btree (_order);


--
-- Name: users_sessions_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX users_sessions_parent_id_idx ON public.users_sessions USING btree (_parent_id);


--
-- Name: users_updated_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX users_updated_at_idx ON public.users USING btree (updated_at);


--
-- Name: wish_comments_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX wish_comments_created_at_idx ON public.wish_comments USING btree (created_at);


--
-- Name: wish_comments_updated_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX wish_comments_updated_at_idx ON public.wish_comments USING btree (updated_at);


--
-- Name: wish_requests_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX wish_requests_created_at_idx ON public.wish_requests USING btree (created_at);


--
-- Name: wish_requests_updated_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX wish_requests_updated_at_idx ON public.wish_requests USING btree (updated_at);


--
-- Name: _events_v _events_v_parent_id_events_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._events_v
    ADD CONSTRAINT _events_v_parent_id_events_id_fk FOREIGN KEY (parent_id) REFERENCES public.events(id) ON DELETE SET NULL;


--
-- Name: _events_v _events_v_version_featured_image_id_media_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._events_v
    ADD CONSTRAINT _events_v_version_featured_image_id_media_id_fk FOREIGN KEY (version_featured_image_id) REFERENCES public.media(id) ON DELETE SET NULL;


--
-- Name: _events_v _events_v_version_location_id_libraries_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._events_v
    ADD CONSTRAINT _events_v_version_location_id_libraries_id_fk FOREIGN KEY (version_location_id) REFERENCES public.libraries(id) ON DELETE SET NULL;


--
-- Name: _news_v _news_v_parent_id_news_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._news_v
    ADD CONSTRAINT _news_v_parent_id_news_id_fk FOREIGN KEY (parent_id) REFERENCES public.news(id) ON DELETE SET NULL;


--
-- Name: _news_v _news_v_version_author_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._news_v
    ADD CONSTRAINT _news_v_version_author_id_users_id_fk FOREIGN KEY (version_author_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: _news_v _news_v_version_featured_image_id_media_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._news_v
    ADD CONSTRAINT _news_v_version_featured_image_id_media_id_fk FOREIGN KEY (version_featured_image_id) REFERENCES public.media(id) ON DELETE SET NULL;


--
-- Name: _news_v _news_v_version_related_library_id_libraries_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._news_v
    ADD CONSTRAINT _news_v_version_related_library_id_libraries_id_fk FOREIGN KEY (version_related_library_id) REFERENCES public.libraries(id) ON DELETE SET NULL;


--
-- Name: _pages_v_blocks_accordion_items _pages_v_blocks_accordion_items_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._pages_v_blocks_accordion_items
    ADD CONSTRAINT _pages_v_blocks_accordion_items_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._pages_v_blocks_accordion(id) ON DELETE CASCADE;


--
-- Name: _pages_v_blocks_accordion _pages_v_blocks_accordion_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._pages_v_blocks_accordion
    ADD CONSTRAINT _pages_v_blocks_accordion_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._pages_v(id) ON DELETE CASCADE;


--
-- Name: _pages_v_blocks_contact_info _pages_v_blocks_contact_info_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._pages_v_blocks_contact_info
    ADD CONSTRAINT _pages_v_blocks_contact_info_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._pages_v(id) ON DELETE CASCADE;


--
-- Name: _pages_v_blocks_downloads _pages_v_blocks_downloads_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._pages_v_blocks_downloads
    ADD CONSTRAINT _pages_v_blocks_downloads_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._pages_v(id) ON DELETE CASCADE;


--
-- Name: _pages_v_blocks_hero _pages_v_blocks_hero_image_id_media_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._pages_v_blocks_hero
    ADD CONSTRAINT _pages_v_blocks_hero_image_id_media_id_fk FOREIGN KEY (image_id) REFERENCES public.media(id) ON DELETE SET NULL;


--
-- Name: _pages_v_blocks_hero _pages_v_blocks_hero_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._pages_v_blocks_hero
    ADD CONSTRAINT _pages_v_blocks_hero_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._pages_v(id) ON DELETE CASCADE;


--
-- Name: _pages_v_blocks_partners_grid _pages_v_blocks_partners_grid_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._pages_v_blocks_partners_grid
    ADD CONSTRAINT _pages_v_blocks_partners_grid_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._pages_v(id) ON DELETE CASCADE;


--
-- Name: _pages_v_blocks_rich_text _pages_v_blocks_rich_text_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._pages_v_blocks_rich_text
    ADD CONSTRAINT _pages_v_blocks_rich_text_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._pages_v(id) ON DELETE CASCADE;


--
-- Name: _pages_v_blocks_video_embed _pages_v_blocks_video_embed_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._pages_v_blocks_video_embed
    ADD CONSTRAINT _pages_v_blocks_video_embed_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._pages_v(id) ON DELETE CASCADE;


--
-- Name: _pages_v _pages_v_parent_id_pages_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._pages_v
    ADD CONSTRAINT _pages_v_parent_id_pages_id_fk FOREIGN KEY (parent_id) REFERENCES public.pages(id) ON DELETE SET NULL;


--
-- Name: _pages_v_rels _pages_v_rels_documents_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._pages_v_rels
    ADD CONSTRAINT _pages_v_rels_documents_fk FOREIGN KEY (documents_id) REFERENCES public.documents(id) ON DELETE CASCADE;


--
-- Name: _pages_v_rels _pages_v_rels_parent_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._pages_v_rels
    ADD CONSTRAINT _pages_v_rels_parent_fk FOREIGN KEY (parent_id) REFERENCES public._pages_v(id) ON DELETE CASCADE;


--
-- Name: _pages_v_rels _pages_v_rels_partners_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._pages_v_rels
    ADD CONSTRAINT _pages_v_rels_partners_fk FOREIGN KEY (partners_id) REFERENCES public.partners(id) ON DELETE CASCADE;


--
-- Name: bookings bookings_room_id_rooms_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_room_id_rooms_id_fk FOREIGN KEY (room_id) REFERENCES public.rooms(id) ON DELETE SET NULL;


--
-- Name: documents documents_file_id_media_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.documents
    ADD CONSTRAINT documents_file_id_media_id_fk FOREIGN KEY (file_id) REFERENCES public.media(id) ON DELETE SET NULL;


--
-- Name: events events_featured_image_id_media_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.events
    ADD CONSTRAINT events_featured_image_id_media_id_fk FOREIGN KEY (featured_image_id) REFERENCES public.media(id) ON DELETE SET NULL;


--
-- Name: events events_location_id_libraries_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.events
    ADD CONSTRAINT events_location_id_libraries_id_fk FOREIGN KEY (location_id) REFERENCES public.libraries(id) ON DELETE SET NULL;


--
-- Name: footer_settings_quick_links footer_settings_quick_links_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.footer_settings_quick_links
    ADD CONSTRAINT footer_settings_quick_links_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.footer_settings(id) ON DELETE CASCADE;


--
-- Name: galleries galleries_cover_image_id_media_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.galleries
    ADD CONSTRAINT galleries_cover_image_id_media_id_fk FOREIGN KEY (cover_image_id) REFERENCES public.media(id) ON DELETE SET NULL;


--
-- Name: galleries galleries_folder_id_payload_folders_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.galleries
    ADD CONSTRAINT galleries_folder_id_payload_folders_id_fk FOREIGN KEY (folder_id) REFERENCES public.payload_folders(id) ON DELETE SET NULL;


--
-- Name: galleries galleries_related_event_id_events_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.galleries
    ADD CONSTRAINT galleries_related_event_id_events_id_fk FOREIGN KEY (related_event_id) REFERENCES public.events(id) ON DELETE SET NULL;


--
-- Name: galleries_rels galleries_rels_media_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.galleries_rels
    ADD CONSTRAINT galleries_rels_media_fk FOREIGN KEY (media_id) REFERENCES public.media(id) ON DELETE CASCADE;


--
-- Name: galleries_rels galleries_rels_parent_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.galleries_rels
    ADD CONSTRAINT galleries_rels_parent_fk FOREIGN KEY (parent_id) REFERENCES public.galleries(id) ON DELETE CASCADE;


--
-- Name: header_settings_nav_items header_settings_nav_items_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.header_settings_nav_items
    ADD CONSTRAINT header_settings_nav_items_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.header_settings(id) ON DELETE CASCADE;


--
-- Name: libraries libraries_featured_image_id_media_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.libraries
    ADD CONSTRAINT libraries_featured_image_id_media_id_fk FOREIGN KEY (featured_image_id) REFERENCES public.media(id) ON DELETE SET NULL;


--
-- Name: media media_folder_id_payload_folders_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.media
    ADD CONSTRAINT media_folder_id_payload_folders_id_fk FOREIGN KEY (folder_id) REFERENCES public.payload_folders(id) ON DELETE SET NULL;


--
-- Name: news news_author_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.news
    ADD CONSTRAINT news_author_id_users_id_fk FOREIGN KEY (author_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: news news_featured_image_id_media_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.news
    ADD CONSTRAINT news_featured_image_id_media_id_fk FOREIGN KEY (featured_image_id) REFERENCES public.media(id) ON DELETE SET NULL;


--
-- Name: news news_related_library_id_libraries_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.news
    ADD CONSTRAINT news_related_library_id_libraries_id_fk FOREIGN KEY (related_library_id) REFERENCES public.libraries(id) ON DELETE SET NULL;


--
-- Name: opening_hours_global_special_periods opening_hours_global_special_periods_affected_library_id_librar; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.opening_hours_global_special_periods
    ADD CONSTRAINT opening_hours_global_special_periods_affected_library_id_librar FOREIGN KEY (affected_library_id) REFERENCES public.libraries(id) ON DELETE SET NULL;


--
-- Name: opening_hours_global_special_periods opening_hours_global_special_periods_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.opening_hours_global_special_periods
    ADD CONSTRAINT opening_hours_global_special_periods_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.opening_hours_global(id) ON DELETE CASCADE;


--
-- Name: opening_hours opening_hours_library_id_libraries_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.opening_hours
    ADD CONSTRAINT opening_hours_library_id_libraries_id_fk FOREIGN KEY (library_id) REFERENCES public.libraries(id) ON DELETE SET NULL;


--
-- Name: pages_blocks_accordion_items pages_blocks_accordion_items_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pages_blocks_accordion_items
    ADD CONSTRAINT pages_blocks_accordion_items_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.pages_blocks_accordion(id) ON DELETE CASCADE;


--
-- Name: pages_blocks_accordion pages_blocks_accordion_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pages_blocks_accordion
    ADD CONSTRAINT pages_blocks_accordion_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.pages(id) ON DELETE CASCADE;


--
-- Name: pages_blocks_contact_info pages_blocks_contact_info_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pages_blocks_contact_info
    ADD CONSTRAINT pages_blocks_contact_info_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.pages(id) ON DELETE CASCADE;


--
-- Name: pages_blocks_downloads pages_blocks_downloads_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pages_blocks_downloads
    ADD CONSTRAINT pages_blocks_downloads_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.pages(id) ON DELETE CASCADE;


--
-- Name: pages_blocks_hero pages_blocks_hero_image_id_media_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pages_blocks_hero
    ADD CONSTRAINT pages_blocks_hero_image_id_media_id_fk FOREIGN KEY (image_id) REFERENCES public.media(id) ON DELETE SET NULL;


--
-- Name: pages_blocks_hero pages_blocks_hero_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pages_blocks_hero
    ADD CONSTRAINT pages_blocks_hero_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.pages(id) ON DELETE CASCADE;


--
-- Name: pages_blocks_partners_grid pages_blocks_partners_grid_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pages_blocks_partners_grid
    ADD CONSTRAINT pages_blocks_partners_grid_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.pages(id) ON DELETE CASCADE;


--
-- Name: pages_blocks_rich_text pages_blocks_rich_text_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pages_blocks_rich_text
    ADD CONSTRAINT pages_blocks_rich_text_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.pages(id) ON DELETE CASCADE;


--
-- Name: pages_blocks_video_embed pages_blocks_video_embed_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pages_blocks_video_embed
    ADD CONSTRAINT pages_blocks_video_embed_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.pages(id) ON DELETE CASCADE;


--
-- Name: pages_rels pages_rels_documents_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pages_rels
    ADD CONSTRAINT pages_rels_documents_fk FOREIGN KEY (documents_id) REFERENCES public.documents(id) ON DELETE CASCADE;


--
-- Name: pages_rels pages_rels_parent_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pages_rels
    ADD CONSTRAINT pages_rels_parent_fk FOREIGN KEY (parent_id) REFERENCES public.pages(id) ON DELETE CASCADE;


--
-- Name: pages_rels pages_rels_partners_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pages_rels
    ADD CONSTRAINT pages_rels_partners_fk FOREIGN KEY (partners_id) REFERENCES public.partners(id) ON DELETE CASCADE;


--
-- Name: partners partners_logo_id_media_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.partners
    ADD CONSTRAINT partners_logo_id_media_id_fk FOREIGN KEY (logo_id) REFERENCES public.media(id) ON DELETE SET NULL;


--
-- Name: payload_folders payload_folders_folder_id_payload_folders_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payload_folders
    ADD CONSTRAINT payload_folders_folder_id_payload_folders_id_fk FOREIGN KEY (folder_id) REFERENCES public.payload_folders(id) ON DELETE SET NULL;


--
-- Name: payload_folders_folder_type payload_folders_folder_type_parent_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payload_folders_folder_type
    ADD CONSTRAINT payload_folders_folder_type_parent_fk FOREIGN KEY (parent_id) REFERENCES public.payload_folders(id) ON DELETE CASCADE;


--
-- Name: payload_locked_documents_rels payload_locked_documents_rels_bookings_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payload_locked_documents_rels
    ADD CONSTRAINT payload_locked_documents_rels_bookings_fk FOREIGN KEY (bookings_id) REFERENCES public.bookings(id) ON DELETE CASCADE;


--
-- Name: payload_locked_documents_rels payload_locked_documents_rels_contact_messages_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payload_locked_documents_rels
    ADD CONSTRAINT payload_locked_documents_rels_contact_messages_fk FOREIGN KEY (contact_messages_id) REFERENCES public.contact_messages(id) ON DELETE CASCADE;


--
-- Name: payload_locked_documents_rels payload_locked_documents_rels_documents_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payload_locked_documents_rels
    ADD CONSTRAINT payload_locked_documents_rels_documents_fk FOREIGN KEY (documents_id) REFERENCES public.documents(id) ON DELETE CASCADE;


--
-- Name: payload_locked_documents_rels payload_locked_documents_rels_donation_pledges_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payload_locked_documents_rels
    ADD CONSTRAINT payload_locked_documents_rels_donation_pledges_fk FOREIGN KEY (donation_pledges_id) REFERENCES public.donation_pledges(id) ON DELETE CASCADE;


--
-- Name: payload_locked_documents_rels payload_locked_documents_rels_events_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payload_locked_documents_rels
    ADD CONSTRAINT payload_locked_documents_rels_events_fk FOREIGN KEY (events_id) REFERENCES public.events(id) ON DELETE CASCADE;


--
-- Name: payload_locked_documents_rels payload_locked_documents_rels_galleries_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payload_locked_documents_rels
    ADD CONSTRAINT payload_locked_documents_rels_galleries_fk FOREIGN KEY (galleries_id) REFERENCES public.galleries(id) ON DELETE CASCADE;


--
-- Name: payload_locked_documents_rels payload_locked_documents_rels_libraries_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payload_locked_documents_rels
    ADD CONSTRAINT payload_locked_documents_rels_libraries_fk FOREIGN KEY (libraries_id) REFERENCES public.libraries(id) ON DELETE CASCADE;


--
-- Name: payload_locked_documents_rels payload_locked_documents_rels_media_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payload_locked_documents_rels
    ADD CONSTRAINT payload_locked_documents_rels_media_fk FOREIGN KEY (media_id) REFERENCES public.media(id) ON DELETE CASCADE;


--
-- Name: payload_locked_documents_rels payload_locked_documents_rels_news_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payload_locked_documents_rels
    ADD CONSTRAINT payload_locked_documents_rels_news_fk FOREIGN KEY (news_id) REFERENCES public.news(id) ON DELETE CASCADE;


--
-- Name: payload_locked_documents_rels payload_locked_documents_rels_newsletter_subscribers_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payload_locked_documents_rels
    ADD CONSTRAINT payload_locked_documents_rels_newsletter_subscribers_fk FOREIGN KEY (newsletter_subscribers_id) REFERENCES public.newsletter_subscribers(id) ON DELETE CASCADE;


--
-- Name: payload_locked_documents_rels payload_locked_documents_rels_opening_hours_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payload_locked_documents_rels
    ADD CONSTRAINT payload_locked_documents_rels_opening_hours_fk FOREIGN KEY (opening_hours_id) REFERENCES public.opening_hours(id) ON DELETE CASCADE;


--
-- Name: payload_locked_documents_rels payload_locked_documents_rels_pages_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payload_locked_documents_rels
    ADD CONSTRAINT payload_locked_documents_rels_pages_fk FOREIGN KEY (pages_id) REFERENCES public.pages(id) ON DELETE CASCADE;


--
-- Name: payload_locked_documents_rels payload_locked_documents_rels_parent_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payload_locked_documents_rels
    ADD CONSTRAINT payload_locked_documents_rels_parent_fk FOREIGN KEY (parent_id) REFERENCES public.payload_locked_documents(id) ON DELETE CASCADE;


--
-- Name: payload_locked_documents_rels payload_locked_documents_rels_partners_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payload_locked_documents_rels
    ADD CONSTRAINT payload_locked_documents_rels_partners_fk FOREIGN KEY (partners_id) REFERENCES public.partners(id) ON DELETE CASCADE;


--
-- Name: payload_locked_documents_rels payload_locked_documents_rels_payload_folders_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payload_locked_documents_rels
    ADD CONSTRAINT payload_locked_documents_rels_payload_folders_fk FOREIGN KEY (payload_folders_id) REFERENCES public.payload_folders(id) ON DELETE CASCADE;


--
-- Name: payload_locked_documents_rels payload_locked_documents_rels_products_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payload_locked_documents_rels
    ADD CONSTRAINT payload_locked_documents_rels_products_fk FOREIGN KEY (products_id) REFERENCES public.products(id) ON DELETE CASCADE;


--
-- Name: payload_locked_documents_rels payload_locked_documents_rels_registrations_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payload_locked_documents_rels
    ADD CONSTRAINT payload_locked_documents_rels_registrations_fk FOREIGN KEY (registrations_id) REFERENCES public.registrations(id) ON DELETE CASCADE;


--
-- Name: payload_locked_documents_rels payload_locked_documents_rels_rooms_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payload_locked_documents_rels
    ADD CONSTRAINT payload_locked_documents_rels_rooms_fk FOREIGN KEY (rooms_id) REFERENCES public.rooms(id) ON DELETE CASCADE;


--
-- Name: payload_locked_documents_rels payload_locked_documents_rels_services_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payload_locked_documents_rels
    ADD CONSTRAINT payload_locked_documents_rels_services_fk FOREIGN KEY (services_id) REFERENCES public.services(id) ON DELETE CASCADE;


--
-- Name: payload_locked_documents_rels payload_locked_documents_rels_staff_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payload_locked_documents_rels
    ADD CONSTRAINT payload_locked_documents_rels_staff_fk FOREIGN KEY (staff_id) REFERENCES public.staff(id) ON DELETE CASCADE;


--
-- Name: payload_locked_documents_rels payload_locked_documents_rels_users_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payload_locked_documents_rels
    ADD CONSTRAINT payload_locked_documents_rels_users_fk FOREIGN KEY (users_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: payload_locked_documents_rels payload_locked_documents_rels_wish_comments_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payload_locked_documents_rels
    ADD CONSTRAINT payload_locked_documents_rels_wish_comments_fk FOREIGN KEY (wish_comments_id) REFERENCES public.wish_comments(id) ON DELETE CASCADE;


--
-- Name: payload_locked_documents_rels payload_locked_documents_rels_wish_requests_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payload_locked_documents_rels
    ADD CONSTRAINT payload_locked_documents_rels_wish_requests_fk FOREIGN KEY (wish_requests_id) REFERENCES public.wish_requests(id) ON DELETE CASCADE;


--
-- Name: payload_preferences_rels payload_preferences_rels_parent_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payload_preferences_rels
    ADD CONSTRAINT payload_preferences_rels_parent_fk FOREIGN KEY (parent_id) REFERENCES public.payload_preferences(id) ON DELETE CASCADE;


--
-- Name: payload_preferences_rels payload_preferences_rels_users_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payload_preferences_rels
    ADD CONSTRAINT payload_preferences_rels_users_fk FOREIGN KEY (users_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: products products_image_id_media_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_image_id_media_id_fk FOREIGN KEY (image_id) REFERENCES public.media(id) ON DELETE SET NULL;


--
-- Name: registrations registrations_event_id_events_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.registrations
    ADD CONSTRAINT registrations_event_id_events_id_fk FOREIGN KEY (event_id) REFERENCES public.events(id) ON DELETE SET NULL;


--
-- Name: rooms_equipment rooms_equipment_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.rooms_equipment
    ADD CONSTRAINT rooms_equipment_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.rooms(id) ON DELETE CASCADE;


--
-- Name: rooms rooms_image_id_media_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.rooms
    ADD CONSTRAINT rooms_image_id_media_id_fk FOREIGN KEY (image_id) REFERENCES public.media(id) ON DELETE SET NULL;


--
-- Name: rooms rooms_library_id_libraries_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.rooms
    ADD CONSTRAINT rooms_library_id_libraries_id_fk FOREIGN KEY (library_id) REFERENCES public.libraries(id) ON DELETE SET NULL;


--
-- Name: services_pricing_table services_pricing_table_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.services_pricing_table
    ADD CONSTRAINT services_pricing_table_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.services(id) ON DELETE CASCADE;


--
-- Name: services services_rules_pdf_id_media_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.services
    ADD CONSTRAINT services_rules_pdf_id_media_id_fk FOREIGN KEY (rules_pdf_id) REFERENCES public.media(id) ON DELETE SET NULL;


--
-- Name: site_metadata site_metadata_og_image_id_media_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.site_metadata
    ADD CONSTRAINT site_metadata_og_image_id_media_id_fk FOREIGN KEY (og_image_id) REFERENCES public.media(id) ON DELETE SET NULL;


--
-- Name: staff staff_avatar_id_media_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.staff
    ADD CONSTRAINT staff_avatar_id_media_id_fk FOREIGN KEY (avatar_id) REFERENCES public.media(id) ON DELETE SET NULL;


--
-- Name: staff staff_department_id_libraries_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.staff
    ADD CONSTRAINT staff_department_id_libraries_id_fk FOREIGN KEY (department_id) REFERENCES public.libraries(id) ON DELETE SET NULL;


--
-- Name: users users_assigned_library_id_libraries_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_assigned_library_id_libraries_id_fk FOREIGN KEY (assigned_library_id) REFERENCES public.libraries(id) ON DELETE SET NULL;


--
-- Name: users_sessions users_sessions_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users_sessions
    ADD CONSTRAINT users_sessions_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

