# Search Interface Workflow

## Screen: `searchInterface.html`

### Overview
The Search Interface provides a powerful, unified search experience across all content types in the ArionComply platform. It features a comprehensive search system with advanced filtering, faceted search, and natural language understanding. The search interface can be accessed directly or triggered from anywhere in the application via the global search bar, keyboard shortcuts, or through the omnipresent chat interface using both text commands and shortcuts. This centralized search capability ensures users can quickly find any content regardless of type, location, or format.

The search system is designed with a federated architecture that searches across all content repositories, including compliance frameworks, documents, tasks, users, companies, and any other data within the system. Results are presented with intelligent ranking that considers relevance, recency, user access patterns, and organizational context.

### Search Architecture

#### 1. Federated Search System
The search infrastructure spans multiple data sources:

- **Content Types**: Searches across all content types (documents, risks, assets, tasks, etc.)
- **Multi-Index Search**: Utilizes specialized indexes for different data types
- **Permission-Aware**: Results filtered based on user permissions
- **Relevance Ranking**: Intelligent sorting based on multiple factors
- **Real-Time Updates**: Index updates when content changes
- **Search Analytics**: Tracks search patterns for optimization

#### 2. Search Activation Methods
Multiple ways to trigger search functionality:

- **Global Search Bar**: Available in header on all screens
- **Dedicated Search Interface**: Full-featured search experience
- **Keyboard Shortcuts**: Quick access via Ctrl/Cmd+K
- **Chat Interface**: Natural language search via chat
- **Quick Commands**: Special shortcut format in chat (e.g., `/search:term`)
- **Voice Search**: Speech-to-text search via chat interface

#### 3. Natural Language Processing
Advanced language understanding capabilities:

- **Intent Recognition**: Understands search intent beyond keywords
- **Semantic Search**: Finds conceptually related content
- **Query Expansion**: Enhances queries with related terms
- **Spell Correction**: Automatically corrects misspellings
- **Synonym Matching**: Recognizes equivalent terms
- **Entity Recognition**: Identifies specific entity types in queries

#### 4. Result Presentation Options
Multiple ways to view and interact with search results:

- **List View**: Traditional ranked list of results
- **Grid View**: Visual card-based layout for certain content
- **Categorized View**: Results grouped by content type
- **Timeline View**: Results organized chronologically
- **Relevance Indicators**: Visual cues for match quality
- **Highlighted Matches**: Shows matching terms in context
- **Result Previews**: Quick view of content without navigation

### User-Triggered Actions

#### 1. Search Execution

- **Action**: Perform search using search bar
  - **Trigger**: Type in search box and press Enter or click search icon
  - **Result**: Executes search and displays results
  - **Process**:
    - Captures search query
    - Processes query through search engine
    - Applies permission filters
    - Retrieves and ranks results
    - Renders results in selected view
  - **State Changes**:
    - Updates URL with search parameters
    - Updates result display
    - Records search in history

- **Action**: Trigger search via keyboard shortcut
  - **Trigger**: Press Ctrl/Cmd+K anywhere in application
  - **Result**: Opens global search with focus
  - **Process**:
    - Captures keyboard event
    - Opens search interface or expands search bar
    - Sets focus to search input
  - **State Changes**:
    - Opens search interface
    - Sets focus to search input

- **Action**: Perform search via chat interface (text)
  - **Trigger**: Type search query in chat (e.g., "search for risk assessments")
  - **Result**: Executes search and displays results in chat or search interface
  - **Process**:
    - AI recognizes search intent
    - Extracts search terms from natural language
    - Executes search with extracted terms
    - Presents results in chat or redirects to search interface
  - **State Changes**:
    - Updates chat with search results or link
    - May navigate to search interface with pre-filled query

- **Action**: Perform search via chat shortcut
  - **Trigger**: Type search shortcut in chat (e.g., `/search:risk assessment`)
  - **Result**: Immediately executes search
  - **Process**:
    - Chat recognizes shortcut format
    - Parses search terms after colon
    - Executes direct search without additional processing
    - Navigates to search interface with results
  - **State Changes**:
    - Navigates to search interface
    - Executes search with specified terms
    - Displays results

- **Action**: Use voice search
  - **Trigger**: Click microphone button in search bar or chat
  - **Result**: Listens for voice input and converts to search
  - **Process**:
    - Activates speech recognition
    - Converts speech to text
    - Processes text as search query
    - Executes search with converted text
  - **State Changes**:
    - Shows voice input indicator
    - Updates search input with transcribed text
    - Executes search with transcribed query

#### 2. Result Filtering and Refinement

- **Action**: Apply content type filter
  - **Trigger**: Select content type from filter sidebar
  - **Result**: Filters results to show only selected types
  - **Process**:
    - Updates filter criteria
    - Re-queries with updated filters
    - Updates result display
    - Updates URL parameters
  - **State Changes**:
    - Updates active filters
    - Updates filtered result set
    - Updates URL filter parameters

- **Action**: Apply date range filter
  - **Trigger**: Set date range in filter sidebar
  - **Result**: Filters results to specified date range
  - **Process**:
    - Updates date range filter
    - Re-queries with date constraints
    - Updates result display
    - Updates URL parameters
  - **State Changes**:
    - Updates date range filter state
    - Updates filtered result set
    - Updates URL filter parameters

- **Action**: Apply faceted filters
  - **Trigger**: Select values from facet groups (status, owner, category, etc.)
  - **Result**: Filters results based on facet selections
  - **Process**:
    - Updates facet selections
    - Re-queries with facet constraints
    - Updates result display and facet options
    - Updates URL parameters
  - **State Changes**:
    - Updates facet selection state
    - Updates filtered result set
    - Updates available facet options
    - Updates URL filter parameters

- **Action**: Modify search scope
  - **Trigger**: Select scope option (All, My Items, Favorites, etc.)
  - **Result**: Changes search context to specified scope
  - **Process**:
    - Updates search scope
    - Re-queries with scope constraint
    - Updates result display
    - Updates URL parameters
  - **State Changes**:
    - Updates active scope
    - Updates filtered result set
    - Updates URL scope parameter

- **Action**: Sort results
  - **Trigger**: Select sort option (Relevance, Date, Name, etc.)
  - **Result**: Reorders results based on sort criteria
  - **Process**:
    - Updates sort parameter
    - Re-orders result set
    - Updates result display
    - Updates URL parameters
  - **State Changes**:
    - Updates active sort option
    - Updates result order
    - Updates URL sort parameter

#### 3. Result Interaction

- **Action**: View result details
  - **Trigger**: Click on search result
  - **Result**: Navigates to detailed view of selected item
  - **Process**:
    - Gets item type and ID from result
    - Determines appropriate view URL
    - Navigates to detailed view
    - May record click in search analytics
  - **State Changes**:
    - Navigates to detailed view
    - Updates search analytics

- **Action**: Preview result
  - **Trigger**: Click preview icon or hover on result (depending on content type)
  - **Result**: Shows quick preview of content without navigation
  - **Process**:
    - Loads preview data for selected item
    - Renders preview overlay or panel
    - Highlights search terms in preview
  - **State Changes**:
    - Shows preview overlay/panel
    - Loads preview content

- **Action**: Quick actions on results
  - **Trigger**: Click action buttons on result item (Edit, Share, etc.)
  - **Result**: Performs action directly from search results
  - **Process**:
    - Executes associated action
    - May open modal dialog or form
    - Updates item if modified
  - **State Changes**:
    - Depends on specific action
    - May open modal or form
    - May update item data

- **Action**: Save search
  - **Trigger**: Click "Save Search" button
  - **Result**: Saves current search and filters for future use
  - **Process**:
    - Captures current search query and all filters
    - Prompts for saved search name
    - Saves search configuration to user preferences
  - **State Changes**:
    - Creates saved search record
    - Updates saved searches list
    - Shows confirmation notification

- **Action**: Share search results
  - **Trigger**: Click "Share" button
  - **Result**: Generates shareable link to current search
  - **Process**:
    - Creates URL with all current search parameters
    - Copies link to clipboard or opens sharing dialog
    - May create permanent link record if advanced sharing
  - **State Changes**:
    - Copies link to clipboard or shows sharing dialog
    - May create shared link record
    - Shows confirmation notification

#### 4. Search History and Saved Searches

- **Action**: View search history
  - **Trigger**: Click "History" tab or button
  - **Result**: Shows list of recent searches
  - **Process**:
    - Retrieves search history from user data
    - Displays chronological list of recent searches
    - Provides options to repeat or modify searches
  - **State Changes**:
    - Updates view to show history
    - May load additional search history data

- **Action**: Use saved search
  - **Trigger**: Select saved search from dropdown or list
  - **Result**: Loads saved search with all filters
  - **Process**:
    - Retrieves saved search configuration
    - Applies saved query and all filters
    - Executes search with saved parameters
    - Updates all filter controls to match saved state
  - **State Changes**:
    - Updates search query and filters
    - Executes search with saved parameters
    - Updates filter controls to match saved state

- **Action**: Clear search history
  - **Trigger**: Click "Clear History" button
  - **Result**: Removes search history
  - **Process**:
    - Confirms user intent
    - Deletes search history records
    - Updates history display
  - **State Changes**:
    - Removes search history records
    - Updates history display
    - Shows confirmation notification

#### 5. Advanced Search Features

- **Action**: Use advanced query syntax
  - **Trigger**: Enter query with special syntax (quotes, operators, etc.)
  - **Result**: Executes search with advanced query parameters
  - **Process**:
    - Parses special syntax in query
    - Translates to advanced search parameters
    - Executes search with enhanced parameters
  - **State Changes**:
    - Updates results based on advanced query
    - May highlight syntax elements in search box

- **Action**: Search within results
  - **Trigger**: Enter terms in "Search within results" field
  - **Result**: Filters current results by additional terms
  - **Process**:
    - Captures secondary search terms
    - Applies as filter to current result set
    - Updates result display
  - **State Changes**:
    - Updates secondary search terms
    - Updates filtered result set
    - May update URL parameters

- **Action**: Expand result context
  - **Trigger**: Click "Show more context" on result
  - **Result**: Expands result to show more surrounding content
  - **Process**:
    - Retrieves additional context for result
    - Expands result display with more content
    - Highlights search terms in expanded content
  - **State Changes**:
    - Updates expanded state for result
    - Shows additional context

### System-Triggered Actions

#### 1. Search Initialization
- **Trigger**: Navigation to search interface or global search activation
- **Process**:
  - Initializes search interface
  - Parses URL parameters for query and filters
  - Sets up filter components
  - Pre-loads user's saved searches
  - Executes search if query present in URL
  - Focuses search input if empty search

#### 2. Search Suggestions
- **Trigger**: Typing in search box
- **Process**:
  - Provides real-time search suggestions
  - Shows recent searches
  - Suggests popular searches
  - Offers query completions
  - Updates suggestions as user types
  - Allows quick selection of suggestions

#### 3. Auto-Complete
- **Trigger**: Typing in search box
- **Process**:
  - Analyzes partial input
  - Offers completion suggestions
  - Prioritizes relevant terms
  - Updates in real-time as typing continues
  - Allows tab completion

#### 4. Result Ranking Optimization
- **Trigger**: Search execution
- **Process**:
  - Applies machine learning ranking model
  - Considers user's past interactions
  - Incorporates organizational context
  - Boosts recently updated content
  - Adjusts ranking based on user role
  - Personalizes results based on user behavior

#### 5. Search Analytics Tracking
- **Trigger**: Search execution and result interaction
- **Process**:
  - Records search queries
  - Tracks result clicks
  - Analyzes search refinements
  - Monitors session duration
  - Identifies zero-result searches
  - Uses data to improve search quality

### Error Handling
- **No Results**: Shows helpful suggestions for broadening search
- **Syntax Errors**: Provides guidance on correct syntax usage
- **Permission Limitations**: Explains why certain content is not searchable
- **Timeout Issues**: Handles long-running searches gracefully
- **Connection Failures**: Supports offline search within cached content
- **Over-Filtering**: Warns when filters eliminate all results

### Data Persistence
- **Primary Storage**: Supabase Database
  - Search configurations stored in database
  - Search history saved to user profile
  - Search analytics stored for optimization
  - Search indexes maintained for performance

- **Key Database Tables**:
  - **search_history**: User search history records
  - **saved_searches**: User-saved search configurations
  - **search_analytics**: Search usage metrics and patterns
  - **search_index_metadata**: Information about search indexes
  - **search_suggestions**: Personalized and popular search suggestions
  - **search_synonyms**: Custom synonym mappings for search expansion
  - **search_relevance_feedback**: User feedback on search relevance

- **Fallback Storage**: 
  - LocalStorage used only when offline or as temporary cache
  - Keys: `search_history_cache`, `recent_searches`, `search_preferences`
  - All local data syncs to database when connection is restored

- **Database Operations**:
  - **Search Interface Load**:
    - **Operation**: SELECT user search preferences, SELECT saved searches
    - **Tables**: `user_search_preferences`, `saved_searches`
    - **Description**: Retrieves user's search settings and saved searches
  
  - **Search Execution**:
    - **Operation**: SEARCH across content with permission filters
    - **Tables**: Multiple content tables with search index
    - **Description**: Executes federated search across all content
  
  - **Record Search History**:
    - **Operation**: INSERT search history record
    - **Tables**: `search_history`
    - **Description**: Records search query and parameters
  
  - **Save Search**:
    - **Operation**: INSERT saved search record
    - **Tables**: `saved_searches`
    - **Description**: Saves search configuration for later use

### AI Integration Points
- **Query Understanding**: AI-powered natural language understanding
- **Intent Recognition**: Identifies search intent beyond keywords
- **Query Reformulation**: Improves queries for better results
- **Result Ranking**: Machine learning for personalized result ordering
- **Search Analytics**: AI analysis of search patterns for improvement
- **Zero-Result Handling**: Intelligent suggestions when no results found
- **Chat Interface Integration**: Natural language search through conversation

### Chat Interface Integration
The omnipresent chat interface integrates with search functionality:

- **Natural Language Search**:
  - Users can simply ask to find content (e.g., "find all high-risk items")
  - AI extracts search intent and parameters from conversation
  - Results can be shown directly in chat or via redirect to search interface
  
- **Search Shortcuts**:
  - Direct search command format: `/search:query`
  - Specialized search formats:
    - `/find:term` - Quick search with high relevance threshold
    - `/recent:term` - Search limited to recently modified content
    - `/mine:term` - Search limited to user's own content
    - `/docs:term` - Search limited to documents
    - `/risks:term` - Search limited to risk register
  
- **Contextual Search**:
  - Chat remembers context for follow-up searches
  - "Find more like this" functionality
  - Refinement of previous searches
  
- **Search Assistance**:
  - Help with advanced search syntax
  - Suggestions for search improvement
  - Explanation of search results
  
- **Voice Search Integration**:
  - Voice input option in chat for search queries
  - Voice results for accessibility

### Integration Dependencies
- **Global Header**: Integration with global search bar
- **Navigation System**: Keyboard shortcuts for search activation
- **User Management**: User permissions affect search results
- **Content Management**: All content types must be searchable
- **Chat Interface**: Search capabilities through conversation
- **Authentication System**: User context for personalized search

### Future Enhancements
1. **Enhanced Semantic Search**:
   - Deep learning-based semantic understanding
   - Concept matching beyond keyword search
   - Domain-specific language understanding

2. **Advanced Personalization**:
   - Learning user preferences over time
   - Role-based result customization
   - Team-specific result optimization

3. **Multimedia Search**:
   - Content extraction from images and diagrams
   - Visual similarity search
   - OCR for embedded text in images

4. **Cross-Language Search**:
   - Multilingual query understanding
   - Translation-based cross-language search
   - Language-specific relevance tuning

5. **Collaborative Search**:
   - Shared search sessions
   - Team search history and insights
   - Collaborative refinement of searches
